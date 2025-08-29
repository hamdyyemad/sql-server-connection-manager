# Debug Configuration Guide

This guide explains how to use the `DEBUG` environment variable to control logging throughout the application, including both server-side and client-side debugging.

## Environment Variables

### .env File

Create a `.env` file in your project root with the following content:

```env
# Debug Configuration
DEBUG=true                    # Server-side debug (Node.js)
NEXT_PUBLIC_DEBUG=true        # Client-side debug (Browser)

# Database Configuration (if needed)
# DB_HOST=localhost
# DB_PORT=1433
# DB_USER=testuser
# DB_PASSWORD=Admin

# Application Configuration
NODE_ENV=development
```

## Server-Side Debug Utility

The application includes a server-side debug utility located at `src/app/utils/debug.ts` that provides controlled logging functions for Node.js environments:

## Client-Side Debug Utility

For browser environments, use the client-side debug utility located at `src/app/utils/client-debug.ts`:
```

### Browser Console Commands

The client debug utility also provides global functions accessible from the browser console:

```javascript
// Enable debug
debug.enable()

// Disable debug
debug.disable()

// Toggle debug
debug.toggle()

// Check if debug is enabled
debug.isEnabled()
```

## Usage Examples

## Controlling Debug Output

### Server-Side Debug

**Enable Debug Logging:**
```env
DEBUG=true
```

**Disable Debug Logging:**
```env
DEBUG=false
```

### Client-Side Debug

**Enable Debug Logging:**
```env
NEXT_PUBLIC_DEBUG=true
```

**Disable Debug Logging:**
```env
NEXT_PUBLIC_DEBUG=false
```

**Runtime Control (Browser):**
```javascript
// Enable via browser console
debug.enable()

// Disable via browser console
debug.disable()

// Or use localStorage directly
localStorage.setItem('DEBUG', 'true')   // Enable
localStorage.setItem('DEBUG', 'false')  // Disable
```

### Environment-Specific Configuration

```env
# Development
DEBUG=true
NEXT_PUBLIC_DEBUG=true

# Production
DEBUG=false
NEXT_PUBLIC_DEBUG=false

# Staging
DEBUG=true
NEXT_PUBLIC_DEBUG=true
```

## Updated Files

The following files have been updated to use the debug utilities:

### Server-Side Files
- `src/backend/middleware/database.ts` - Database middleware logging
- `src/backend/handlers/get-aspnet-users.ts` - User retrieval logging
- All other handlers can be updated similarly

### Client-Side Files
- `src/app/components/DebugExample.tsx` - Example React component
- Any React components can import and use the client debug utility

## Benefits

1. **Production Ready**: No debug output in production
2. **Development Friendly**: Detailed logging during development
3. **Runtime Control**: Enable/disable client debug without rebuilding
4. **Performance**: No logging overhead when disabled
5. **Consistent**: Standardized logging format across the application
6. **Flexible**: Easy to enable/disable per environment

## Migration Guide



### Server-Side Testing

1. **With DEBUG=true:**
   ```bash
   # You should see debug messages in the server console
   npm run dev
   ```

2. **With DEBUG=false:**
   ```bash
   # You should see no debug messages
   npm run dev
   ```

### Client-Side Testing

1. **With NEXT_PUBLIC_DEBUG=true:**
   ```bash
   # You should see debug messages in the browser console
   npm run dev
   ```

2. **With NEXT_PUBLIC_DEBUG=false:**
   ```bash
   # You should see no debug messages
   npm run dev
   ```

3. **Runtime Testing:**
   ```javascript
   // In browser console
   debug.enable()   // Should show debug messages
   debug.disable()  // Should hide debug messages
   ```

## Troubleshooting

### Server-side debug messages not showing
- Check that `DEBUG=true` is set in your `.env` file
- Ensure the `.env` file is in the project root
- Restart your development server after changing the `.env` file

### Client-side debug messages not showing
- Check that `NEXT_PUBLIC_DEBUG=true` is set in your `.env` file
- Try enabling debug via browser console: `debug.enable()`
- Check localStorage: `localStorage.getItem('DEBUG')`

### Debug messages showing in production
- Ensure `DEBUG=false` and `NEXT_PUBLIC_DEBUG=false` in your production environment
- Check that your deployment process includes the `.env` file
- Verify that the environment variables are being read correctly

### Performance issues
- Debug logging has minimal overhead when disabled
- If you experience performance issues, ensure debug is disabled in production
- Consider using different debug levels for different types of logging 