import type { ConnectionInfo } from "../../backend_lib/types/database";

/**
 * Generate a dashboard URL with connection parameters
 */
export function generateDashboardUrl(
  connection: ConnectionInfo,
  authToken?: string
): string {
  const params = new URLSearchParams();

  // Add connection parameters
  params.append("server", connection.server);
  if (connection.user) params.append("user", connection.user);
  if (connection.password) params.append("password", connection.password);
  if (connection.authenticationType)
    params.append("authType", connection.authenticationType);

  // Add auth token if provided
  if (authToken) params.append("token", authToken);

  return `/dashboard?${params.toString()}`;
}

/**
 * Generate a dashboard URL with minimal parameters (just server and token)
 */
export function generateSimpleDashboardUrl(
  server: string,
  authToken?: string
): string {
  const params = new URLSearchParams();
  params.append("server", server);

  if (authToken) params.append("token", authToken);

  return `/dashboard?${params.toString()}`;
}

/**
 * Check if a URL contains dashboard connection parameters
 */
export function hasDashboardParams(url: string): boolean {
  const urlObj = new URL(url, window.location.origin);
  return urlObj.searchParams.has("server");
}

/**
 * Extract connection info from dashboard URL
 */
export function extractConnectionFromUrl(url: string): Partial<ConnectionInfo> {
  const urlObj = new URL(url, window.location.origin);
  const params = urlObj.searchParams;

  return {
    server: params.get("server") || undefined,
    user: params.get("user") || undefined,
    password: params.get("password") || undefined,
    authenticationType: params.get("authType") as "sql" | "windows" | undefined,
  };
}
