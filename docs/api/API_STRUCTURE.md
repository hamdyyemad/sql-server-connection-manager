# API Structure Documentation

## Overview

This project now uses a structured API approach with versioning, middleware, and centralized types. The backend logic is properly separated into its own folder structure. The application supports both local and remote SQL Server connections with automatic local instance detection and Windows/SQL Authentication.

## Directory Structure

```
src/
├── backend/                        # Backend logic folder
│   ├── middleware/
│   │   └── database.ts            # Database connection middleware
│   ├── handlers/                   # Database operation handlers
│   │   ├── index.ts               # Handler exports
│   │   ├── test-connection.ts
│   │   ├── list-databases.ts
│   │   ├── list-tables.ts
│   │   ├── get-table-rows.ts
│   │   └── detect-local-instances.ts
│   └── index.ts                   # Backend exports
├── app/
│   └── api/
│       └── v1/                    # Versioned API endpoints
│           ├── test-connection/
│           ├── list-databases/
│           ├── list-tables/
│           ├── get-table-rows/
│           └── detect-local-instances/
├── types/
│   └── database.ts                # Centralized type definitions
└── app/
    ├── components/
    │   ├── ConnectionModal.tsx    # Updated with auto-detection
    │   ├── ConnectionCard.tsx     # Connection display component
    │   └── index/
    │       ├── CreateConnectionCard.tsx
    │       └── ConnectionCards.tsx
    └── store/
        └── useConnectionsStore.ts # Updated store with local connection validation
```

## Connection Types

The application now supports two types of connections:

### 1. **Local SQL Server Connection**

- **Purpose**: Connect to SQL Server running on the same machine
- **Authentication**: Windows Authentication (trusted connection) - **Automatic**
- **Detection**: Automatically detects available local instances
- **Server Examples**: `localhost`, `localhost\SQLEXPRESS`, `127.0.0.1`
- **Limitation**: Only one local connection allowed
- **Use Case**: Development, testing, local databases
- **Features**:
  - Auto-detection of SQL Server instances
  - No manual server name entry required
  - Automatic Windows Authentication
  - Instance information display (edition, version)

### 2. **Remote SQL Server Connection**

- **Purpose**: Connect to SQL Server on a remote machine
- **Authentication**: SQL Server Authentication or Windows Authentication
- **Server Examples**: `ATLAS-CB38B4CQ0`, `192.168.1.100`, `server.domain.com`
- **Limitation**: Multiple remote connections allowed
- **Use Case**: Production databases, shared servers
- **Features**:
  - Manual server name entry
  - Authentication type selection
  - Username/password for SQL auth

## Authentication Types

### Windows Authentication

- **Local**: Uses current Windows identity (trusted connection) - **Automatic**
- **Remote**: Requires domain credentials (DOMAIN\username)

### SQL Server Authentication

- **Local**: Not available (local connections use Windows Auth only)
- **Remote**: Username and password required

## Backend Structure

### Middleware (`src/backend/middleware/`)

- **database.ts**: Handles database connections, authentication, and error handling

### Handlers (`src/backend/handlers/`)

- **test-connection.ts**: Tests database connectivity
- **list-databases.ts**: Lists all databases on a server
- **list-tables.ts**: Lists tables in a specific database
- **get-table-rows.ts**: Retrieves rows from a specific table
- **detect-local-instances.ts**: Automatically detects local SQL Server instances
- **index.ts**: Exports all handlers for clean imports

### Backend Index (`src/backend/index.ts`)

- Central export point for all backend functionality
- Provides clean imports: `import { withDatabase, testConnectionHandler, detectLocalInstances } from '@/backend'`

## API Endpoints

All endpoints are now versioned under `/api/v1/`:

- `GET /api/v1/detect-local-instances` - Detect available local SQL Server instances
- `POST /api/v1/test-connection` - Test database connection
- `POST /api/v1/list-databases` - List all databases
- `POST /api/v1/list-tables` - List tables in a database
- `POST /api/v1/get-table-rows` - Get rows from a table

## Local Instance Detection

### How It Works

1. **Automatic Detection**: When user selects "Local SQL Server", the app automatically detects available instances
2. **Common Instances**: Tries common local instance names:
   - `localhost`
   - `localhost\SQLEXPRESS`
   - `localhost\MSSQLSERVER`
   - `127.0.0.1`
   - `127.0.0.1\SQLEXPRESS`
   - `127.0.0.1\MSSQLSERVER`
   - `(local)`
   - `(local)\SQLEXPRESS`
   - `(local)\MSSQLSERVER`
3. **Connection Testing**: Tests each instance with a 3-second timeout
4. **Instance Information**: Retrieves server details (edition, version)
5. **Auto-Selection**: Uses the first detected instance

### Detection Process

```typescript
// The detection tries these instances in order:
const commonInstances = [
  "localhost",
  "localhost\\SQLEXPRESS",
  "localhost\\MSSQLSERVER",
  "127.0.0.1",
  "127.0.0.1\\SQLEXPRESS",
  "127.0.0.1\\MSSQLSERVER",
  "(local)",
  "(local)\\SQLEXPRESS",
  "(local)\\MSSQLSERVER",
];
```

## Middleware

The `withDatabase` middleware handles:

- Connection pooling
- Authentication type validation
- Local vs remote connection handling
- Error handling
- Connection cleanup

### Usage Example

```typescript
import { withDatabase, testConnectionHandler } from "@/backend";

export async function POST(request: NextRequest) {
  const result = await withDatabase(request, testConnectionHandler);

  if (result.success) {
    return NextResponse.json(result.data, { status: 200 });
  } else {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
}
```

## Request Format

All API endpoints expect a POST request with the following body:

```typescript
{
  server: string;                    // Required
  authenticationType: 'windows' | 'sql'; // Required
  user?: string;                     // Required for SQL auth
  password?: string;                 // Required for SQL auth
  connectionType?: 'local' | 'remote'; // Optional, defaults based on auth type
  // Additional endpoint-specific fields...
}
```

## Store Features

### Connection Management

- **Add Connection**: Validates local connection uniqueness
- **Remove Connection**: Allows removing connections
- **Local Connection Check**: Prevents multiple local connections
- **Connection Display**: Shows connection type, status, and details

### Validation Rules

- Only one local SQL Server connection allowed
- Remote connections have no limit
- Local connections automatically use Windows Authentication
- Remote connections can use either authentication type

## Benefits

1. **Better Organization**: Backend logic is separated from API routes
2. **Cleaner Imports**: Single import point for backend functionality
3. **DRY Principle**: No more repeated connection logic
4. **Type Safety**: Centralized type definitions
5. **Versioning**: Easy to maintain API versions
6. **Authentication Flexibility**: Support for both auth types
7. **Local Development**: Easy local SQL Server connections with auto-detection
8. **Better Error Handling**: Consistent error responses
9. **Separation of Concerns**: Clear distinction between API routes and business logic
10. **Connection Management**: Proper validation and display of connections
11. **Auto-Detection**: No manual configuration needed for local connections
12. **User Experience**: Simplified UI for local connections
