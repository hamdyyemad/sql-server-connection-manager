# Quick Debug Start Guide

## 🚀 Get Started with Debugging in 5 Minutes

### 1. **Frontend Debugging (Browser)**

#### Quick Start:
1. **Open your app** in browser: `http://localhost:3000`
2. **Press F12** to open DevTools
3. **Go to Console tab** - you'll see debug logs with 🔍 emojis
4. **Try connecting to a database** - watch the logs flow!

#### Set Breakpoints:
1. **Go to Sources tab** in DevTools
2. **Find your file**: `webpack://` → `src/` → `app/components/ConnectionModal.tsx`
3. **Click line numbers** to set breakpoints
4. **Try the form** - execution will pause at breakpoints

### 2. **Backend Debugging (VS Code)**

#### Quick Start:
1. **Open VS Code** in your project folder
2. **Press F5** or go to Run & Debug panel
3. **Select "Next.js: debug API routes"**
4. **Set breakpoints** in your API files:
   - `src/app/api/v1/test-connection/route.ts`
   - `src/backend/middleware/database.ts`
   - `src/backend/handlers/test-connection.ts`
5. **Try connecting** - VS Code will pause at breakpoints

### 3. **Console Debugging (Terminal)**

#### Quick Start:
1. **Start your app**: `npm run dev`
2. **Watch the terminal** - you'll see detailed debug logs
3. **Try connecting** - see the full flow in console

## 🔍 What You'll See

### Frontend Logs (Browser Console):
```
🔍 Debug: Form submitted {server: "ATLAS-CB38B4CQ0", user: "test", authenticationType: "sql", hasPassword: true}
🔍 Debug: Making API call to /api/v1/test-connection
🔍 Debug: API Response status: 200
🔍 Debug: API Response data: {message: "Successfully connected..."}
```

### Backend Logs (Terminal):
```
🔍 Debug: withDatabase middleware called
📦 Request body: {server: "ATLAS-CB38B4CQ0", user: "***", authenticationType: "sql", hasPassword: true}
🔐 Debug: Authentication type: sql
🔗 Debug: Creating connection pool...
✅ Debug: Connected to server: ATLAS-CB38B4CQ0 using sql authentication
🔍 Debug: testConnectionHandler called
✅ Debug: Connection test successful
```

## 🎯 Debugging Workflow

### For Connection Issues:
1. **Check browser console** for frontend errors
2. **Check terminal** for backend errors
3. **Set breakpoint** in `database.ts` middleware
4. **Step through** the connection process

### For UI Issues:
1. **Use React DevTools** to inspect component state
2. **Set breakpoints** in `ConnectionModal.tsx`
3. **Watch state changes** in real-time

### For API Issues:
1. **Check Network tab** in DevTools
2. **Set breakpoints** in API route handlers
3. **Inspect request/response** data

## 🛠️ Pro Tips

### 1. **Use the debugger statement**:
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  debugger; // Browser pauses here
  // your code
};
```

### 2. **Conditional debugging**:
```typescript
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}
```

### 3. **Network debugging**:
- Open DevTools → Network tab
- Filter by "Fetch/XHR"
- Click on API calls to see details

### 4. **State debugging**:
- Install React DevTools extension
- Use Components tab to inspect state

## 🚨 Common Issues

### Breakpoints not hitting?
- Make sure you're in development mode
- Check if source maps are enabled
- Try refreshing the page

### Can't see console logs?
- Check if console is filtered
- Make sure log level is set to "All"
- Try `console.error()` for important messages

### VS Code debugging not working?
- Make sure you selected the right debug configuration
- Check if the app is running on the correct port
- Try restarting VS Code

## 🎉 You're Ready!

Now you can:
- ✅ Debug frontend React components
- ✅ Debug backend API routes
- ✅ Debug database connections
- ✅ Set breakpoints anywhere
- ✅ Track the full request/response flow

Happy debugging! 🐛✨ 