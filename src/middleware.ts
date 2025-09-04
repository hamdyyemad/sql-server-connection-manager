import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { JWTUtils } from "@/backend_lib/utils/jwt";

// Import debug utilities to activate console override
import "./backend_lib/utils/debug-init";

const loginPath = "/auth/login";

// Define auth pages
const AUTH_PAGES = ["/auth/login", "/auth/2fa-setup", "/auth/2fa-verify"];

// Type for middleware functions
type MiddlewareFunction = (
  request: NextRequest
) => Promise<NextResponse | null>;

// Main middleware function with chaining
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Performance: Quick exit for static assets and API routes
  if (isQuickExit(pathname)) {
    return NextResponse.next();
  }

  // Chain middlewares based on path type
  if (isAuthPath(pathname)) {
    return chainMiddlewares(request, [authPagesMiddleware]);
  } else {
    return chainMiddlewares(request, [nonAuthPagesMiddleware]);
  }
}

// Middleware chaining utility
async function chainMiddlewares(
  request: NextRequest,
  middlewares: MiddlewareFunction[]
): Promise<NextResponse> {
  for (const middleware of middlewares) {
    const result = await middleware(request);
    if (result) {
      return result;
    }
  }
  return NextResponse.next();
}

// Middleware for auth pages (login, 2fa-setup, 2fa-verify)
async function authPagesMiddleware(
  request: NextRequest
): Promise<NextResponse | null> {
  const { pathname } = request.nextUrl;

  // For GET requests, check authentication status and redirect if needed
  const authToken = request.cookies.get("auth-token")?.value;

  // If no auth token, stay on current auth page
  if (!authToken) {
    if (pathname !== "/auth/login") {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    console.log(`[AuthMiddleware] No auth token, staying on: ${pathname}`);
    return null;
  }

  try {
    // Check if token is a JWT token (starts with eyJ)
    if (authToken.startsWith("eyJ")) {
      // Get user flags from JWT token (Edge Runtime compatible)
      const userFlags = JWTUtils.getUserFlagsFromToken(authToken);

      if (!userFlags.isAuthenticated) {
        console.log(
          `[AuthMiddleware] Invalid or expired JWT token, redirecting to /auth/login`
        );
        if (pathname !== "/auth/login") {
          return NextResponse.redirect(new URL("/auth/login", request.url));
        }
        return null;
      }

      console.log(
        `[AuthMiddleware] JWT - is2FAEnabled: ${userFlags.is2FAEnabled}, hasSetup2FA: ${userFlags.hasSetup2FA}, is2FAVerified: ${userFlags.is2FAVerified}, secret2FAHasValue: ${userFlags.secret2FAHasValue}, tempSecret2FAHasValue: ${userFlags.tempSecret2FAHasValue}, needsVerification: ${userFlags.needsVerification}`
      );

      // Handle different auth pages
      switch (pathname) {
        case "/auth/login":
          return handleLoginPageRedirect(request, {
            is2FAEnabled: userFlags.is2FAEnabled,
            hasSetup2FA: userFlags.hasSetup2FA,
            is2FAVerified: userFlags.is2FAVerified,
            needsVerification: userFlags.needsVerification, // Will be determined by the redirect logic
            secret2FAHasValue: userFlags.secret2FAHasValue,
            tempSecret2FAHasValue: userFlags.tempSecret2FAHasValue,
          });

        case "/auth/2fa-setup":
          return handle2FASetupPageRedirect(request, {
            is2FAEnabled: userFlags.is2FAEnabled,
            hasSetup2FA: userFlags.hasSetup2FA,
            is2FAVerified: userFlags.is2FAVerified,
            needsVerification: userFlags.needsVerification, // Will be determined by the redirect logic
            secret2FAHasValue: userFlags.secret2FAHasValue,
            tempSecret2FAHasValue: userFlags.tempSecret2FAHasValue,
          });

        case "/auth/2fa-verify":
          return handle2FAVerifyPageRedirect(request, {
            is2FAEnabled: userFlags.is2FAEnabled,
            hasSetup2FA: userFlags.hasSetup2FA,
            is2FAVerified: userFlags.is2FAVerified,
            needsVerification: userFlags.needsVerification, // Will be determined by the redirect logic
            secret2FAHasValue: userFlags.secret2FAHasValue,
            tempSecret2FAHasValue: userFlags.tempSecret2FAHasValue,
          });

        default:
          return null;
      }
    } else {
      // Legacy token handling - fallback to database check for backward compatibility
      console.log(
        `[AuthMiddleware] Legacy token detected, using database check`
      );
      const { check2FAStatusAction } = await import(
        "@/backend_lib/actions/2fa"
      );
      const result = await check2FAStatusAction();

      if (!result.success) {
        console.log(
          `[AuthMiddleware] Invalid legacy auth token, staying on: ${pathname}`
        );
        if (pathname !== "/auth/login") {
          return NextResponse.redirect(new URL("/auth/login", request.url));
        }
        return null;
      }

      const {
        is2FAEnabled = false,
        hasSetup2FA = false,
        is2FAVerified = false,
        needsVerification = false,
        secret2FAHasValue = false,
        tempSecret2FAHasValue = false,
      } = result;

      console.log(
        `[AuthMiddleware] Legacy - is2FAEnabled: ${is2FAEnabled}, hasSetup2FA: ${hasSetup2FA}, is2FAVerified: ${is2FAVerified}, needsVerification: ${needsVerification}, secret2FAHasValue: ${secret2FAHasValue}, tempSecret2FAHasValue: ${tempSecret2FAHasValue}`
      );

      // Handle different auth pages
      switch (pathname) {
        case "/auth/login":
          return handleLoginPageRedirect(request, {
            is2FAEnabled,
            hasSetup2FA,
            is2FAVerified,
            needsVerification,
            secret2FAHasValue,
            tempSecret2FAHasValue,
          });

        case "/auth/2fa-setup":
          return handle2FASetupPageRedirect(request, {
            is2FAEnabled,
            hasSetup2FA,
            is2FAVerified,
            needsVerification,
            secret2FAHasValue,
            tempSecret2FAHasValue,
          });

        case "/auth/2fa-verify":
          return handle2FAVerifyPageRedirect(request, {
            is2FAEnabled,
            hasSetup2FA,
            is2FAVerified,
            needsVerification,
            secret2FAHasValue,
            tempSecret2FAHasValue,
          });

        default:
          return null;
      }
    }
  } catch (error) {
    console.error(
      "[AuthMiddleware] Error checking authentication status:",
      error
    );
    return null;
  }
}

// Handle login page redirects
function handleLoginPageRedirect(
  request: NextRequest,
  flags: {
    is2FAEnabled: boolean;
    hasSetup2FA: boolean;
    is2FAVerified: boolean;
    needsVerification: boolean;
    secret2FAHasValue: boolean;
    tempSecret2FAHasValue: boolean;
  }
): NextResponse | null {
  const { is2FAEnabled, hasSetup2FA, is2FAVerified, needsVerification } = flags;

  // If 2FA is disabled, go directly to homepage
  if (is2FAEnabled === false) {
    console.log("[AuthMiddleware] 2FA is disabled, redirecting to homepage");
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If 2FA is set up and verified, go to homepage
  if (
    hasSetup2FA === true &&
    is2FAVerified === true &&
    needsVerification === false
  ) {
    console.log(
      "[AuthMiddleware] 2FA is set up and verified, redirecting to homepage"
    );
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If 2FA is set up but not verified, go to 2FA setup
  if (hasSetup2FA === true && is2FAVerified === false) {
    console.log(
      "[AuthMiddleware] 2FA is set up but not verified, redirecting to 2FA setup"
    );
    return NextResponse.redirect(new URL("/auth/2fa-setup", request.url));
  }

  // If needs verification, go to 2FA verify
  if (needsVerification === true) {
    console.log(
      "[AuthMiddleware] Needs verification, redirecting to 2FA verify"
    );
    return NextResponse.redirect(new URL("/auth/2fa-verify", request.url));
  }

  // Otherwise, go to 2FA verify (user needs to set up 2FA)
  console.log("[AuthMiddleware] Redirecting to 2FA verify");
  return NextResponse.redirect(new URL("/auth/2fa-verify", request.url));
}

// Handle 2FA setup page redirects
function handle2FASetupPageRedirect(
  request: NextRequest,
  flags: {
    is2FAEnabled: boolean;
    hasSetup2FA: boolean;
    is2FAVerified: boolean;
    needsVerification: boolean;
    secret2FAHasValue: boolean;
    tempSecret2FAHasValue: boolean;
  }
): NextResponse | null {
  const { is2FAEnabled, hasSetup2FA, is2FAVerified, needsVerification } = flags;

  // If 2FA is disabled, go directly to homepage
  if (is2FAEnabled === false) {
    console.log("[AuthMiddleware] 2FA is disabled, redirecting to homepage");
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If 2FA is set up and verified, go to homepage
  if (
    hasSetup2FA === true &&
    is2FAVerified === true &&
    needsVerification === false
  ) {
    console.log(
      "[AuthMiddleware] 2FA is set up and verified, redirecting to homepage"
    );
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If 2FA is set up but not verified, check if we have a secret
  if (hasSetup2FA === true && is2FAVerified === false) {
    // Check if there's a temporary 2FA secret in cookies
    const tempSecret = request.cookies.get("temp-2fa-secret")?.value;
    if (tempSecret) {
      console.log(
        "[AuthMiddleware] 2FA secret exists, redirecting to 2FA verify"
      );
      return NextResponse.redirect(new URL("/auth/2fa-verify", request.url));
    } else {
      console.log("[AuthMiddleware] Staying on 2FA setup page");
      return null;
    }
  }

  // Otherwise, stay on setup page
  return null;
}

// Handle 2FA verify page redirects
function handle2FAVerifyPageRedirect(
  request: NextRequest,
  flags: {
    is2FAEnabled: boolean;
    hasSetup2FA: boolean;
    is2FAVerified: boolean;
    needsVerification: boolean;
    secret2FAHasValue: boolean;
    tempSecret2FAHasValue: boolean;
  }
): NextResponse | null {
  const {
    is2FAEnabled,
    hasSetup2FA,
    is2FAVerified,
    needsVerification,
    secret2FAHasValue,
    tempSecret2FAHasValue,
  } = flags;

  // If 2FA is disabled, go directly to homepage
  if (is2FAEnabled === false) {
    console.log("[AuthMiddleware] 2FA is disabled, redirecting to homepage");
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If 2FA is set up and verified, go to homepage
  if (
    hasSetup2FA === true &&
    is2FAVerified === true &&
    needsVerification === false
  ) {
    console.log(
      "[AuthMiddleware] 2FA is set up and verified, redirecting to homepage"
    );
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Check if user has hasSetup2FA = true but no actual secrets (both false)
  if (hasSetup2FA === true && !secret2FAHasValue && !tempSecret2FAHasValue) {
    console.log(
      "[AuthMiddleware] User has hasSetup2FA=true but no secrets, redirecting to 2FA setup"
    );
    return NextResponse.redirect(new URL("/auth/2fa-setup", request.url));
  }

  // Otherwise, stay on verify page
  return null;
}

// Middleware for non-auth pages (protected routes)
async function nonAuthPagesMiddleware(
  request: NextRequest
): Promise<NextResponse | null> {
  const { pathname } = request.nextUrl;

  // Get user authentication and 2FA status for protected routes
  const {
    isAuthenticated,
    hasSetup2FA,
    is2FAVerified,
    is2FAEnabled,
    secret2FAHasValue,
    tempSecret2FAHasValue,
  } = await getUserFlags(request);

  // Branch 1: Unauthenticated users accessing protected routes
  if (!isAuthenticated) {
    console.log(
      `[NonAuthMiddleware] Redirecting unauthenticated user to /auth/login from: ${pathname}`
    );
    return NextResponse.redirect(new URL(loginPath, request.url));
  }

  // Branch 1.5: Authenticated users with incomplete 2FA setup (no secrets)
  if (
    is2FAEnabled &&
    hasSetup2FA &&
    !secret2FAHasValue &&
    !tempSecret2FAHasValue
  ) {
    console.log(
      `[NonAuthMiddleware] User has incomplete 2FA setup (no secrets), cleaning cookies and redirecting to login from: ${pathname}`
    );
    const response = NextResponse.redirect(new URL(loginPath, request.url));
    // Clean authentication cookies
    response.cookies.delete("auth-token");
    response.cookies.delete("temp-2fa-secret");
    return response;
  }

  // Branch 2: Authenticated users requiring 2FA verification
  if (is2FAEnabled && hasSetup2FA && !is2FAVerified) {
    console.log(
      `[NonAuthMiddleware] User requires 2FA verification, redirecting from: ${pathname}`
    );
    return NextResponse.redirect(new URL("/auth/2fa-verify", request.url));
  }

  // Branch 3: Authenticated users who need to set up 2FA
  if (is2FAEnabled && !hasSetup2FA) {
    console.log(
      `[NonAuthMiddleware] User needs to set up 2FA, redirecting from: ${pathname}`
    );
    return NextResponse.redirect(new URL("/auth/2fa-setup", request.url));
  }

  // Branch 4: Fully authenticated users - allow access to protected route
  console.log(
    `[NonAuthMiddleware] User is fully authenticated, allowing access to: ${pathname}`
  );
  return null; // Allow access
}

function isQuickExit(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname === "/.well-known/appspecific/com.chrome.devtools.json"
  );
}

function isAuthPath(pathname: string): boolean {
  return AUTH_PAGES.some((authPath) => pathname.startsWith(authPath));
}

async function getUserFlags(request: NextRequest) {
  const authToken = request.cookies.get("auth-token")?.value;
  const isAuthenticated = !!authToken;

  if (!isAuthenticated) {
    return {
      isAuthenticated: false,
      hasSetup2FA: false,
      is2FAVerified: false,
      is2FAEnabled: true,
      secret2FAHasValue: false,
      tempSecret2FAHasValue: false,
    };
  }

  try {
    if (!authToken) {
      return {
        isAuthenticated: false,
        hasSetup2FA: false,
        is2FAVerified: false,
        is2FAEnabled: true,
        secret2FAHasValue: false,
        tempSecret2FAHasValue: false,
      };
    }

    // Check if token is a JWT token (starts with eyJ)
    if (authToken.startsWith("eyJ")) {
      // Use JWT token for authentication
      const userFlags = JWTUtils.getUserFlagsFromToken(authToken);
      console.log(`[Middleware] JWT - User flags:`, userFlags);
      return userFlags;
    } else {
      // Legacy token handling - fallback to database check for backward compatibility
      console.log(`[Middleware] Legacy token detected, using database check`);
      const { check2FAStatusAction } = await import(
        "@/backend_lib/actions/2fa"
      );
      const result = await check2FAStatusAction();

      if (!result.success) {
        return {
          isAuthenticated: false,
          hasSetup2FA: false,
          is2FAVerified: false,
          is2FAEnabled: true,
          secret2FAHasValue: false,
          tempSecret2FAHasValue: false,
        };
      }

      const userFlags = {
        isAuthenticated: true,
        hasSetup2FA: result.hasSetup2FA || false,
        is2FAVerified: result.is2FAVerified || false,
        is2FAEnabled: result.is2FAEnabled !== false, // Default to true if not specified
        secret2FAHasValue: result.secret2FAHasValue || false,
        tempSecret2FAHasValue: result.tempSecret2FAHasValue || false,
      };

      console.log(`[Middleware] Legacy - User flags:`, userFlags);
      return userFlags;
    }
  } catch (error) {
    console.error("[Middleware] Error getting user flags:", error);
    return {
      isAuthenticated: false,
      hasSetup2FA: false,
      is2FAVerified: false,
      is2FAEnabled: true,
      secret2FAHasValue: false,
      tempSecret2FAHasValue: false,
    };
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     * - public files (you can add more extensions)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp)).*)",
  ],
};
