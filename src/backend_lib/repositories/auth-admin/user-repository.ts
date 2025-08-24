import { db } from "./lib/database";
import { User, UserRepository, UserProjection } from "@/backend_lib/types/auth";
import { v4 as uuidv4 } from "uuid";

export class TursoUserRepository implements UserRepository {
  async findByUsername(username: string): Promise<User | null> {
    try {
      const result = await db.execute({
        sql: "SELECT * FROM users WHERE username = ? AND isActive = 1",
        args: [username],
      });

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        id: row.id as string,
        username: row.username as string,
        passwordHash: row.passwordHash as string,
        passwordSalt: row.passwordSalt as string,
        hasSetup2FA: Boolean(row.hasSetup2FA),
        is2FAVerified: Boolean(row.is2FAVerified),
        is2FAEnabled: Boolean(row.is2FAEnabled),
        secret2FA: row.secret2FA as string | undefined,
        tempSecret2FA: row.tempSecret2FA as string | undefined,
        isActive: Boolean(row.isActive),
        createdAt: row.createdAt as string,
        updatedAt: row.updatedAt as string,
        lastLoginAt: row.lastLoginAt as string | undefined,
      };
    } catch (error) {
      console.error("Error finding user by username:", error);
      throw error;
    }
  }

  async findByUsernameWithProjection<T extends Partial<User>>(
    username: string,
    projection: UserProjection
  ): Promise<T | null> {
    try {
      // Build SELECT clause based on projection array
      const selectedColumns = projection.join(", ");

      if (!selectedColumns) {
        throw new Error("At least one column must be selected in projection");
      }

      const result = await db.execute({
        sql: `SELECT ${selectedColumns} FROM users WHERE username = ? AND isActive = 1`,
        args: [username],
      });

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      const user: Partial<User> = {};

      // Map selected columns to user object
      projection.forEach((column) => {
        if (
          column === "hasSetup2FA" ||
          column === "isActive" ||
          column === "is2FAVerified" ||
          column === "is2FAEnabled"
        ) {
          user[column] = Boolean(row[column]);
        } else {
          user[column] = row[column] as User[typeof column];
        }
      });

      return user as T;
    } catch (error) {
      console.error("Error finding user by username with projection:", error);
      throw error;
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const result = await db.execute({
        sql: "SELECT * FROM users WHERE id = ? AND isActive = 1",
        args: [id],
      });

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        id: row.id as string,
        username: row.username as string,
        passwordHash: row.passwordHash as string,
        passwordSalt: row.passwordSalt as string,
        hasSetup2FA: Boolean(row.hasSetup2FA),
        is2FAVerified: Boolean(row.is2FAVerified),
        is2FAEnabled: Boolean(row.is2FAEnabled),
        secret2FA: row.secret2FA as string | undefined,
        tempSecret2FA: row.tempSecret2FA as string | undefined,
        isActive: Boolean(row.isActive),
        createdAt: row.createdAt as string,
        updatedAt: row.updatedAt as string,
        lastLoginAt: row.lastLoginAt as string | undefined,
      };
    } catch (error) {
      console.error("Error finding user by id:", error);
      throw error;
    }
  }

  async findByIdWithProjection<T extends Partial<User>>(
    id: string,
    projection: UserProjection
  ): Promise<T | null> {
    try {
      // Build SELECT clause based on projection array
      const selectedColumns = projection.join(", ");

      if (!selectedColumns) {
        throw new Error("At least one column must be selected in projection");
      }

      const result = await db.execute({
        sql: `SELECT ${selectedColumns} FROM users WHERE id = ? AND isActive = 1`,
        args: [id],
      });

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      const user: Partial<User> = {};

      // Map selected columns to user object
      projection.forEach((column) => {
        if (
          column === "hasSetup2FA" ||
          column === "isActive" ||
          column === "is2FAVerified" ||
          column === "is2FAEnabled"
        ) {
          user[column] = Boolean(row[column]);
        } else {
          user[column] = row[column] as User[typeof column];
        }
      });

      return user as T;
    } catch (error) {
      console.error("Error finding user by id with projection:", error);
      throw error;
    }
  }

  async create(
    user: Omit<User, "id" | "createdAt" | "updatedAt">
  ): Promise<User> {
    try {
      const id = uuidv4();
      const now = new Date().toISOString();

      await db.execute({
        sql: `INSERT INTO users (id, username, passwordHash, passwordSalt, hasSetup2FA, is2FAVerified, is2FAEnabled, secret2FA, tempSecret2FA, isActive, createdAt, updatedAt) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          id,
          user.username,
          user.passwordHash,
          user.passwordSalt,
          user.hasSetup2FA ? 1 : 0,
          user.is2FAVerified ? 1 : 0,
          user.is2FAEnabled ? 1 : 0,
          user.secret2FA || null,
          user.tempSecret2FA || null,
          user.isActive ? 1 : 0,
          now,
          now,
        ],
      });

      return {
        ...user,
        id,
        createdAt: now,
        updatedAt: now,
      };
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async update(id: string, updates: Partial<User>): Promise<User> {
    try {
      const user = await this.findById(id);
      if (!user) {
        throw new Error("User not found");
      }

      const updateFields: string[] = [];
      const args: (string | number | boolean | null)[] = [];

      if (updates.username !== undefined) {
        updateFields.push("username = ?");
        args.push(updates.username);
      }
      if (updates.passwordHash !== undefined) {
        updateFields.push("passwordHash = ?");
        args.push(updates.passwordHash);
      }
      if (updates.passwordSalt !== undefined) {
        updateFields.push("passwordSalt = ?");
        args.push(updates.passwordSalt);
      }
      if (updates.hasSetup2FA !== undefined) {
        updateFields.push("hasSetup2FA = ?");
        args.push(updates.hasSetup2FA ? 1 : 0);
      }
      if (updates.is2FAVerified !== undefined) {
        updateFields.push("is2FAVerified = ?");
        args.push(updates.is2FAVerified ? 1 : 0);
      }
      if (updates.is2FAEnabled !== undefined) {
        updateFields.push("is2FAEnabled = ?");
        args.push(updates.is2FAEnabled ? 1 : 0);
      }
      if (updates.secret2FA !== undefined) {
        updateFields.push("secret2FA = ?");
        args.push(updates.secret2FA);
      }
      if (updates.tempSecret2FA !== undefined) {
        updateFields.push("tempSecret2FA = ?");
        args.push(updates.tempSecret2FA);
      }
      if (updates.isActive !== undefined) {
        updateFields.push("isActive = ?");
        args.push(updates.isActive ? 1 : 0);
      }
      if (updates.lastLoginAt !== undefined) {
        updateFields.push("lastLoginAt = ?");
        args.push(updates.lastLoginAt);
      }

      if (updateFields.length === 0) {
        return user;
      }

      args.push(id);
      await db.execute({
        sql: `UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`,
        args,
      });

      return (await this.findById(id)) as User;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await db.execute({
        sql: "UPDATE users SET isActive = 0 WHERE id = ?",
        args: [id],
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  async updateLastLogin(id: string): Promise<void> {
    try {
      await db.execute({
        sql: "UPDATE users SET lastLoginAt = ? WHERE id = ?",
        args: [new Date().toISOString(), id],
      });
    } catch (error) {
      console.error("Error updating last login:", error);
      throw error;
    }
  }

  async update2FASecret(id: string, secret: string): Promise<void> {
    try {
      await db.execute({
        sql: "UPDATE users SET secret2FA = ? WHERE id = ?",
        args: [secret, id],
      });
    } catch (error) {
      console.error("Error updating 2FA secret:", error);
      throw error;
    }
  }

  async update2FAStatus(id: string, hasSetup2FA: boolean): Promise<void> {
    try {
      await db.execute({
        sql: "UPDATE users SET hasSetup2FA = ? WHERE id = ?",
        args: [hasSetup2FA ? 1 : 0, id],
      });
    } catch (error) {
      console.error("Error updating 2FA status:", error);
      throw error;
    }
  }

  async updateTempSecret(userId: string, secret: string): Promise<void> {
    try {
      await db.execute({
        sql: "UPDATE users SET tempSecret2FA = ? WHERE id = ?",
        args: [secret, userId],
      });
    } catch (error) {
      console.error("Error updating temp secret:", error);
      throw error;
    }
  }

  async complete2FASetup(userId: string, secret: string): Promise<void> {
    try {
      await db.execute({
        sql: "UPDATE users SET secret2FA = ?, tempSecret2FA = NULL, hasSetup2FA = 1 WHERE id = ?",
        args: [secret, userId],
      });
    } catch (error) {
      console.error("Error completing 2FA setup:", error);
      throw error;
    }
  }

  async update2FAVerificationStatus(
    userId: string,
    isVerified: boolean
  ): Promise<void> {
    try {
      await db.execute({
        sql: "UPDATE users SET is2FAVerified = ? WHERE id = ?",
        args: [isVerified ? 1 : 0, userId],
      });
    } catch (error) {
      console.error("Error updating 2FA verification status:", error);
      throw error;
    }
  }

  async update2FAEnablement(userId: string, isEnabled: boolean): Promise<void> {
    try {
      await db.execute({
        sql: "UPDATE users SET is2FAEnabled = ? WHERE id = ?",
        args: [isEnabled ? 1 : 0, userId],
      });
    } catch (error) {
      console.error("Error updating 2FA enablement:", error);
      throw error;
    }
  }

  async reset2FAVerification(userId: string): Promise<void> {
    try {
      await db.execute({
        sql: "UPDATE users SET is2FAVerified = 0 WHERE id = ?",
        args: [userId],
      });
    } catch (error) {
      console.error("Error resetting 2FA verification:", error);
      throw error;
    }
  }
}
