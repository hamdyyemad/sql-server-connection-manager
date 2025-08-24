# Dashboard URL Examples

## Direct Access with Connection Parameters

The dashboard now supports direct access with connection parameters in the URL. This allows you to access the dashboard without going through the connection setup flow.

### Basic Examples

#### 1. Minimal Parameters (Server Only)

```
/dashboard?server=localhost&token=your-auth-token
```

#### 2. Full Connection Parameters

```
/dashboard?server=localhost&user=myuser&password=mypassword&authType=sql&token=your-auth-token
```

#### 3. Windows Authentication

```
/dashboard?server=localhost&user=domain\\username&password=mypassword&authType=windows&token=your-auth-token
```

### URL Parameter Reference

| Parameter  | Required | Description             | Example                        |
| ---------- | -------- | ----------------------- | ------------------------------ |
| `server`   | Yes      | Database server name/IP | `localhost` or `192.168.1.100` |
| `user`     | No       | Database username       | `sa` or `domain\\username`     |
| `password` | No       | Database password       | `mypassword123`                |
| `authType` | No       | Authentication type     | `sql` or `windows`             |
| `token`    | No       | Authentication token    | JWT token from login           |

### Usage Scenarios

#### Scenario 1: Direct Dashboard Access

```javascript
// Generate dashboard URL with full connection info
const dashboardUrl = `/dashboard?server=localhost&user=sa&password=password123&authType=sql&token=${authToken}`;
window.location.href = dashboardUrl;
```

#### Scenario 2: From Connection Store

```javascript
import { generateDashboardUrl } from "@/frontend_lib/utils/dashboardUtils";

const connection = {
  server: "localhost",
  user: "sa",
  password: "password123",
  authenticationType: "sql",
};

const dashboardUrl = generateDashboardUrl(connection, authToken);
router.push(dashboardUrl);
```

#### Scenario 3: Minimal Access (Uses Default Credentials)

```javascript
// This will use the default testuser/Admin credentials
const dashboardUrl = `/dashboard?server=localhost&token=${authToken}`;
window.location.href = dashboardUrl;
```

### Security Considerations

1. **URL Parameters**: Connection credentials are visible in the URL. Consider using POST requests for sensitive data in production.

2. **Token Security**: The auth token should be handled securely and not logged.

3. **HTTPS**: Always use HTTPS in production to encrypt URL parameters.

### Fallback Behavior

If connection parameters are not provided:

1. Dashboard will try to use the current connection from the store
2. If no connection is available, shows connection selector
3. If only server is provided, uses default credentials (testuser/Admin)

### Testing Examples

#### Test with Local SQL Server

```
http://localhost:3000/dashboard?server=localhost&token=your-token
```

#### Test with Remote Server

```
http://localhost:3000/dashboard?server=192.168.1.100&user=sa&password=password&authType=sql&token=your-token
```

#### Test with Windows Auth

```
http://localhost:3000/dashboard?server=localhost&user=domain\\user&password=password&authType=windows&token=your-token
```

### Error Handling

The dashboard will show appropriate error messages for:

- Missing server parameter
- Invalid connection credentials
- Database connection failures
- Missing authentication token

### Integration with Existing Flow

The dashboard maintains backward compatibility:

- If accessed through the sidebar with an active connection, it will use the connection store
- If accessed directly with URL parameters, it will use those parameters
- If no parameters or connection are available, it shows the connection selector
