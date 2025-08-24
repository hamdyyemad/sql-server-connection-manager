import { NextRequest, NextResponse } from "next/server";

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration
export const RATE_LIMIT_CONFIG = {
  windowMs: 5 * 60 * 1000, // 5 minutes
  maxRequests: 5, // 5 requests per window
};

/**
 * Get client IP address from request headers
 */
export function getClientIP(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

/**
 * Check rate limit for a client IP
 * Let's say it's currently 2:00 PM (now = 1400)
 * Client makes first request at 2:00 PM
 * resetTime = now + windowMs
 * resetTime = 1400 + (15 * 60 * 1000) = 1500 // 2:15 PM
 * At 2:10 PM (now = 1410):
 * clientData.resetTime < now → 1500 < 1410 → false (window still active)
 * At 2:20 PM (now = 1520):
 * clientData.resetTime < now → 1500 < 1520 → true (window expired, reset!)
 */
export function checkRateLimit(clientIP: string): {
  allowed: boolean;
  remaining: number;
} {
  const now = Date.now();
  const clientData = rateLimitStore.get(clientIP);
  const windowExpiredAndNeedsReset =
    clientData?.resetTime && now > clientData.resetTime;

  if (!clientData || windowExpiredAndNeedsReset) {
    // Reset or create new rate limit data
    rateLimitStore.set(clientIP, {
      count: 1,
      resetTime: now + RATE_LIMIT_CONFIG.windowMs,
    });
    return { allowed: true, remaining: RATE_LIMIT_CONFIG.maxRequests - 1 };
  }

  if (clientData.count > RATE_LIMIT_CONFIG.maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  // Increment count
  clientData.count++;
  rateLimitStore.set(clientIP, clientData);

  return {
    allowed: true,
    remaining: RATE_LIMIT_CONFIG.maxRequests - clientData.count,
  };
}

/**
 * Add security headers to response
 */
export function addSecurityHeaders(
  response: NextResponse,
  rateLimit: { remaining: number }
): NextResponse {
  response.headers.set(
    "X-RateLimit-Limit",
    RATE_LIMIT_CONFIG.maxRequests.toString()
  );
  response.headers.set("X-RateLimit-Remaining", rateLimit.remaining.toString());
  response.headers.set(
    "X-RateLimit-Reset",
    new Date(Date.now() + RATE_LIMIT_CONFIG.windowMs).toISOString()
  );
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

/**
 * Create a rate limit exceeded response
 */
export function createRateLimitResponse(): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: "Too many requests. Please try again later.",
      code: "RATE_LIMIT_EXCEEDED",
    },
    { status: 429 }
  );
}

/**
 * Clear rate limit data for a specific IP (useful for testing)
 */
export function clearRateLimit(clientIP: string): void {
  rateLimitStore.delete(clientIP);
}

/**
 * Get current rate limit data for a specific IP (useful for debugging)
 */
export function getRateLimitData(clientIP: string) {
  return rateLimitStore.get(clientIP);
}
