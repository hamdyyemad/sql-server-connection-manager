# Next.js Debugging Guide

## 🎯 Frontend Debugging (React Components)

### 1. Browser Developer Tools

#### Chrome DevTools
1. **Open DevTools**: Press `F12` or `Ctrl+Shift+I`
2. **Go to Sources tab**
3. **Find your component files**:
   - Look in `webpack://` → `src/` → `app/components/`
   - Or use `Ctrl+P` and search for your file name
4. **Set breakpoints** by clicking on line numbers
5. **Use console.log()** for quick debugging:

```typescript
// In your React components
const handleSubmit = async (e: React.FormEvent) => {
  console.log('Form submitted:', { server, user, authenticationType });
  debugger; // This will pause execution
  // ... rest of your code
};
```

#### Firefox DevTools
- Similar to Chrome, but with different UI
- Use `Ctrl+Shift+K` for console
- Sources tab works the same way

### 2. React Developer Tools

1. **Install React DevTools extension**:
   - [Chrome Extension](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
   - [Firefox Extension](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

2. **Use the Components tab** to:
   - Inspect component state
   - See props being passed
   - Monitor state changes

### 3. VS Code Debugging

#### Setup VS Code for Frontend Debugging

1. **Create `.vscode/launch.json`**:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}",
      "sourceMapPathOverrides": {
        "webpack://_N_E/*": "${webRoot}/*",
        "webpack:///./*": "${webRoot}/*"
      }
    },
    {
      "name": "Next.js: debug full stack",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/next/dist/bin/next",
      "args": ["dev"],
      "cwd": "${workspaceFolder}",
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

2. **Set breakpoints in VS Code**:
   - Open your component files
   - Click on line numbers to set breakpoints
   - Press `F5` to start debugging

## 🔧 Backend Debugging (API Routes)

### 1. VS Code Backend Debugging

#### Setup for API Routes

1. **Update `.vscode/launch.json`** to include API debugging:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug API routes",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/next/dist/bin/next",
      "args": ["dev"],
      "cwd": "${workspaceFolder}",
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"],
      "env": {
        "NODE_OPTIONS": "--inspect"
      }
    }
  ]
}
```

2. **Set breakpoints in your API routes**:
   - Open `src/app/api/v1/test-connection/route.ts`
   - Set breakpoints in the handler functions
   - Start debugging with `F5`

### 2. Console Logging for Backend

Add detailed logging to your handlers:

```typescript
// In src/backend/handlers/test-connection.ts
export const testConnectionHandler: DatabaseHandler = async (req, pool) => {
  console.log('🔍 Debug: Starting test connection');
  console.log('📊 Request config:', req.dbConfig);
  
  try {
    // Your logic here
    console.log('✅ Connection successful');
    return {
      success: true,
      data: {
        message: `Successfully connected to ${req.dbConfig.server}`
      }
    };
  } catch (error) {
    console.error('❌ Connection failed:', error);
    throw error;
  }
};
```

### 3. Middleware Debugging

Add debugging to your database middleware:

```typescript
// In src/backend/middleware/database.ts
export async function withDatabase(
  request: NextRequest,
  handler: DatabaseHandler
) {
  console.log('🔍 Debug: withDatabase called');
  
  const body = await request.json();
  console.log('📦 Request body:', body);
  
  const { server, user, password, authenticationType } = body;
  
  console.log('🔐 Auth type:', authenticationType);
  console.log('🖥️ Server:', server);
  
  // ... rest of your code
}
```

## 🐛 Advanced Debugging Techniques

### 1. Environment Variables for Debugging

Create `.env.local`:

```bash
# Debug flags
DEBUG_DATABASE=true
DEBUG_API=true
LOG_LEVEL=debug
```

Use in your code:

```typescript
const isDebug = process.env.DEBUG_DATABASE === 'true';

if (isDebug) {
  console.log('🔍 Database operation:', { server, authType });
}
```

### 2. Debugging Database Connections

Add detailed logging to database operations:

```typescript
// In your handlers
export const listDatabasesHandler: DatabaseHandler = async (req, pool) => {
  console.log('🔍 Debug: Listing databases');
  console.log('📊 Pool state:', pool.connected ? 'Connected' : 'Disconnected');
  
  try {
    const result = await pool.request().query("SELECT name FROM sys.databases");
    console.log('📋 Query result:', result.recordset);
    
    return {
      success: true,
      data: { databases: result.recordset }
    };
  } catch (error) {
    console.error('❌ Database query failed:', error);
    throw error;
  }
};
```

### 3. Network Tab Debugging

1. **Open Chrome DevTools** → **Network tab**
2. **Filter by XHR/Fetch** to see API calls
3. **Click on requests** to see:
   - Request headers and body
   - Response data
   - Timing information

### 4. Redux DevTools (if using state management)

If you're using Zustand or Redux:

```typescript
// In your store
export const useConnectionsStore = create<ConnectionsState>()(
  persist(
    (set, get) => ({
      connections: [],
      addConnection: (conn) => {
        console.log('🔍 Debug: Adding connection:', conn);
        set((state) => ({
          connections: [...state.connections, conn],
        }));
      },
      // ... rest of your store
    }),
    {
      name: 'connections-storage',
      storage: base64Storage,
    }
  )
);
```

## 🚀 Quick Debugging Tips

### 1. **Use debugger statement**:
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  debugger; // Browser will pause here
  // ... your code
};
```

### 2. **Conditional logging**:
```typescript
const DEBUG = process.env.NODE_ENV === 'development';

if (DEBUG) {
  console.log('Debug info:', data);
}
```

### 3. **Error boundaries** (for React):
```typescript
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error('React error:', error, errorInfo);
  }
}
```

### 4. **API response debugging**:
```typescript
const res = await fetch("/api/v1/test-connection", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ server, user, password, authenticationType }),
});

console.log('🔍 API Response status:', res.status);
const data = await res.json();
console.log('🔍 API Response data:', data);
```

## 🎯 Debugging Workflow

1. **Start with console.log()** for quick debugging
2. **Use browser DevTools** for frontend issues
3. **Use VS Code debugging** for complex backend logic
4. **Check Network tab** for API issues
5. **Use React DevTools** for component state issues

## 🔧 VS Code Extensions for Better Debugging

- **ES7+ React/Redux/React-Native snippets**
- **Auto Rename Tag**
- **Bracket Pair Colorizer**
- **Error Lens**
- **Thunder Client** (for API testing) 