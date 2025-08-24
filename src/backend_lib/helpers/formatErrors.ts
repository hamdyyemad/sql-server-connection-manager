// Format error messages for better user experience
export function formatConnectionError(
  error: Error,
  server: string,
  authenticationType: string
): string {
  const errorMessage = error.message;

  if (errorMessage.includes("Could not connect")) {
    return (
      `Unable to connect to server '${server}'. Please check:\n` +
      `1. Server name is correct\n` +
      `2. SQL Server is running\n` +
      `3. Port 1433 is accessible\n` +
      `4. Firewall allows connections\n` +
      `5. For Windows Authentication: SQL Server allows SQL Authentication`
    );
  }

  if (errorMessage.includes("Login failed")) {
    if (authenticationType === "windows") {
      return (
        `SQL Authentication failed for testuser. This might be because:\n` +
        `1. SQL Server doesn't allow SQL Authentication\n` +
        `2. testuser login doesn't exist and couldn't be created\n` +
        `3. SQL Server is configured for Windows Authentication only\n\n` +
        `Try using SQL Server Authentication with your own credentials instead.`
      );
    }
    return "Authentication failed. Please check your credentials.";
  }

  if (errorMessage.includes("Windows Authentication")) {
    return (
      `Windows Authentication failed. Please ensure:\n` +
      `1. SQL Server allows SQL Authentication\n` +
      `2. testuser login can be created or already exists\n` +
      `3. SQL Server service is running`
    );
  }

  return errorMessage;
}
