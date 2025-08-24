# Security Testing Scripts

This directory contains comprehensive security testing tools for the authentication system.

## 🔒 Security Tester

A comprehensive security testing tool that tests API endpoints for various vulnerabilities.

### Features

- **SQL Injection Testing**: Tests for SQL injection vulnerabilities
- **XSS Testing**: Tests for Cross-Site Scripting vulnerabilities
- **NoSQL Injection Testing**: Tests for NoSQL injection vulnerabilities
- **Brute Force Testing**: Tests brute force attack protection
- **Rate Limiting Testing**: Tests rate limiting implementation
- **Input Validation Testing**: Tests input validation and sanitization

### Usage

#### Test a single endpoint:

```bash
node scripts/security/security-tester.js login
node scripts/security/security-tester.js setup-2fa
node scripts/security/security-tester.js verify-2fa
node scripts/security/security-tester.js check-2fa-status
```

#### Test all endpoints:

```bash
node scripts/security/security-tester.js all
```

#### Show help:

```bash
node scripts/security/security-tester.js help
```

#### Available Commands:

- `login`: Test the login endpoint (`/api/v1/auth/login`)
- `setup-2fa`: Test the 2FA setup endpoint (`/api/v1/auth/setup-2fa`)
- `verify-2fa`: Test the 2FA verification endpoint (`/api/v1/auth/verify-2fa`)
- `check-2fa-status`: Test the 2FA status check endpoint (`/api/v1/auth/check-2fa-status`)
- `all`: Test all authentication endpoints
- `help`: Show usage information

### Test All Auth Endpoints

Run comprehensive security tests on all authentication endpoints:

```bash
node scripts/security/security-tester.js all
```

This command tests:

- `/api/v1/auth/login`
- `/api/v1/auth/setup-2fa`
- `/api/v1/auth/verify-2fa`
- `/api/v1/auth/check-2fa-status`

## 🛡️ Security Features Tested

### SQL Injection Protection

Tests against common SQL injection patterns:

- `' OR '1'='1`
- `'; DROP TABLE users;--`
- `' UNION SELECT * FROM users--`
- And many more...

### XSS Protection

Tests against XSS payloads:

- `<script>alert('XSS')</script>`
- `<img src=x onerror=alert('XSS')>`
- `javascript:alert('XSS')`
- And many more...

### NoSQL Injection Protection

Tests against NoSQL injection patterns:

- `{"$gt": ""}`
- `{"$ne": null}`
- `{"$where": "1==1"}`
- And many more...

### Brute Force Protection

Tests brute force attack protection by:

- Attempting multiple login attempts with different credentials
- Checking if rate limiting is properly implemented
- Verifying that failed attempts are properly handled

### Rate Limiting

Tests rate limiting by:

- Sending rapid requests to endpoints
- Checking for 429 status codes
- Verifying rate limit headers

### Input Validation

Tests input validation by:

- Sending empty strings, null, undefined values
- Testing with very long strings
- Testing with special characters and Unicode
- Testing with SQL keywords and script tags

## 📊 Test Results

The security tester provides detailed reports including:

- **Vulnerability Detection**: Identifies specific vulnerabilities found
- **Payload Information**: Shows the exact payload that triggered the vulnerability
- **Response Analysis**: Analyzes server responses for security indicators
- **Summary Report**: Provides an overall security assessment

## 🔧 Configuration

### Environment Variables

- `BASE_URL`: Base URL for the API (default: http://localhost:3000)

### Customization

You can customize the security tester by modifying:

- Payload lists in `security-tester.js`
- Test parameters and thresholds
- Response analysis logic
- Report formatting

## ⚠️ Important Notes

1. **Use Responsibly**: Only test endpoints you own or have permission to test
2. **Development Environment**: Run tests in development environment only
3. **Rate Limiting**: The tester includes delays to avoid overwhelming the server
4. **False Positives**: Some tests may generate false positives - always verify results manually

## 🚀 Quick Start

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start your development server:

   ```bash
   npm run dev
   ```

3. Run security tests:

   ```bash
   # Test all auth endpoints
   node scripts/security/security-tester.js all

   # Test specific endpoint
   node scripts/security/security-tester.js login
   ```

## 📝 Example Output

```
🔒 Testing All Authentication Endpoints for Security Vulnerabilities

============================================================
Testing: Login endpoint
Endpoint: POST /api/v1/auth/login
Body Keys: username, password
============================================================

🔍 Testing SQL Injection vulnerabilities...
🔍 Testing XSS vulnerabilities...
🔍 Testing NoSQL Injection vulnerabilities...
🔍 Testing Brute Force attacks (10 attempts)...
✅ Brute force protection appears to be working
🔍 Testing Rate Limiting (20 rapid requests)...
✅ Rate limiting is working: 15 requests were rate limited
🔍 Testing Input Validation...

📊 Security Test Report
Total tests: 156
Vulnerabilities found: 0

✅ No vulnerabilities detected!
```

## 🔗 Related Files

- `security-tester.js`: Main security testing tool
- `test-auth-endpoints.js`: Example script for testing all auth endpoints
- `README.md`: This documentation file
