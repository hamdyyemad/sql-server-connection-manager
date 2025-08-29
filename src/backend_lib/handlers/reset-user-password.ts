import type { DatabaseHandler } from '../middleware/database';
import { ParameterBinder, SQLInjectionPrevention } from '../middleware/sql-injection-prevention';
import { ApiError } from '../middleware/error-handler';
import * as crypto from 'crypto';

// .NET Identity Password Hasher Implementation - Exact Match
// Based on Microsoft.AspNetCore.Identity.PasswordHasher<TUser>
function hashPassword(password: string): string {
  // .NET Identity V3 format constants (from actual source code)
  const formatMarker = 0x01; // PBKDF2 with HMAC
  const prf = 2; // KeyDerivationPrf.HMACSHA512 = 2 (HMACSHA1=0, HMACSHA256=1, HMACSHA512=2)
  const iterCount = 600000; // Current .NET 9 default iteration count
  const saltSize = 16; // 128-bit salt
  const numBytesRequested = 32; // 256-bit subkey

  // Generate random salt
  const salt = crypto.randomBytes(saltSize);
  
  // Generate subkey using PBKDF2 with HMAC-SHA512 (matching .NET exactly)
  const subkey = crypto.pbkdf2Sync(password, salt, iterCount, numBytesRequested, 'sha512');
  
  // Create output buffer: 13 bytes header + salt + subkey
  const outputBytes = Buffer.alloc(13 + saltSize + numBytesRequested);
  let offset = 0;
  
  // Write format marker (1 byte)
  outputBytes[offset] = formatMarker;
  offset += 1;
  
  // Write PRF (4 bytes, network byte order / big-endian)
  writeNetworkByteOrder(outputBytes, offset, prf);
  offset += 4;
  
  // Write iteration count (4 bytes, network byte order / big-endian)
  writeNetworkByteOrder(outputBytes, offset, iterCount);
  offset += 4;
  
  // Write salt size (4 bytes, network byte order / big-endian)
  writeNetworkByteOrder(outputBytes, offset, saltSize);
  offset += 4;
  
  // Write salt
  salt.copy(outputBytes, offset);
  offset += saltSize;
  
  // Write subkey
  subkey.copy(outputBytes, offset);
  
  return outputBytes.toString('base64');
}

// Helper function to write uint32 in network byte order (big-endian)
// Exactly matching .NET's WriteNetworkByteOrder method
function writeNetworkByteOrder(buffer: Buffer, offset: number, value: number): void {
  buffer[offset] = (value >> 24) & 0xFF;
  buffer[offset + 1] = (value >> 16) & 0xFF;
  buffer[offset + 2] = (value >> 8) & 0xFF;
  buffer[offset + 3] = value & 0xFF;
}

export const resetUserPasswordHandler: DatabaseHandler = async (req, pool) => {
  const { database, userId, customPassword } = req.parsedBody;
  
  if (!database || !userId) {
    throw ApiError.badRequest('Database name and user ID are required');
  }

  // Validate database name to prevent SQL injection
  const sqlPrevention = new SQLInjectionPrevention();
  const dbValidation = sqlPrevention.validateIdentifier(database, 'database');
  
  if (!dbValidation.isValid) {
    throw ApiError.badRequest(`Invalid database name: ${dbValidation.error}`);
  }

  // Use the sanitized database name directly in queries
  const sanitizedDatabase = dbValidation.sanitized;
  const binder = new ParameterBinder();
  
  // Generate a random password if not provided
  const newPassword = customPassword || generateRandomPassword();
  
  // Generate .NET Identity compatible password hash
  const passwordHash = hashPassword(newPassword);
  
  // Generate new security stamp
  const securityStamp = crypto.randomUUID().replace(/-/g, '').toUpperCase();
  const concurrencyStamp = crypto.randomUUID();
  
  // Add parameters for values only
  const userIdParam = binder.addParameter(userId);
  const passwordHashParam = binder.addParameter(passwordHash);
  const securityStampParam = binder.addParameter(securityStamp);
  const concurrencyStampParam = binder.addParameter(concurrencyStamp);
  
  // Start a transaction
  const transaction = new (await import('mssql')).Transaction(pool);
  await transaction.begin();

  try {
    // Update user password with new hash and stamps
    const updateQuery = `
      UPDATE [${sanitizedDatabase}].[dbo].[AspNetUsers] 
      SET 
        [PasswordHash] = ${passwordHashParam},
        [SecurityStamp] = ${securityStampParam},
        [ConcurrencyStamp] = ${concurrencyStampParam},
        [ChangePass] = 1
      WHERE [Id] = ${userIdParam}
    `;
    
    const updateRequest = transaction.request();
    updateRequest.input(passwordHashParam, passwordHash);
    updateRequest.input(securityStampParam, securityStamp);
    updateRequest.input(concurrencyStampParam, concurrencyStamp);
    updateRequest.input(userIdParam, userId);
    
    const result = await updateRequest.query(updateQuery);
    
    if (result.rowsAffected[0] === 0) {
      throw ApiError.notFound('User not found');
    }

    await transaction.commit();
    
    console.log(`Reset password for user ${userId} in database ${sanitizedDatabase}`);
    
    return {
      success: true,
      data: { 
        message: 'Password reset successfully',
        newPassword: newPassword,
        note: `New password: ${newPassword} (User will be required to change on next login)`
      }
    };
  } catch (error) {
    await transaction.rollback();
    throw error; // Re-throw to let middleware handle it
  }
};

// Generate a random password
function generateRandomPassword(): string {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  // Ensure at least one character from each category
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // uppercase
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // lowercase
  password += '0123456789'[Math.floor(Math.random() * 10)]; // digit
  password += '!@#$%^&*'[Math.floor(Math.random() * 8)]; // special
  
  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
} 