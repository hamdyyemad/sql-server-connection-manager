import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * Cookie options interface for consistent cookie configuration
 */
export interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
  maxAge?: number;
  path?: string;
  domain?: string;
}

/**
 * Static utility class for managing cookies across different contexts
 * Supports both API responses (NextResponse) and server actions (cookies())
 */
export class CookieUtils {
  /**
   * Default cookie options for authentication cookies
   */
  private static readonly DEFAULT_AUTH_OPTIONS: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60, // 24 hours
    path: "/",
  };

  /**
   * Set a cookie on a NextResponse object (for API routes)
   *
   * @param response - The NextResponse object
   * @param name - Cookie name
   * @param value - Cookie value
   * @param options - Cookie options (optional)
   *
   * @example
   * ```typescript
   * const response = NextResponse.json(data);
   * CookieUtils.set(response, "auth-token", userId);
   * return response;
   * ```
   */
  static set(
    response: NextResponse,
    name: string,
    value: string,
    options: CookieOptions = {}
  ): void {
    const finalOptions = { ...this.DEFAULT_AUTH_OPTIONS, ...options };
    response.cookies.set(name, value, finalOptions);
  }

  /**
   * Set a cookie using Next.js cookies() API (for server actions)
   *
   * @param cookieStore - The cookie store from cookies()
   * @param name - Cookie name
   * @param value - Cookie value
   * @param options - Cookie options (optional)
   *
   * @example
   * ```typescript
   * await CookieUtils.setForAction(cookies(), "auth-token", userId);
   * ```
   */
  static async setForAction(
    cookieStore: ReturnType<typeof cookies>,
    name: string,
    value: string,
    options: CookieOptions = {}
  ): Promise<void> {
    const cookies = await cookieStore;
    const finalOptions = { ...this.DEFAULT_AUTH_OPTIONS, ...options };
    cookies.set(name, value, finalOptions);
  }

  /**
   * Get a cookie value using Next.js cookies() API
   *
   * @param cookieStore - The cookie store from cookies()
   * @param name - Cookie name
   * @returns Cookie value or undefined if not found
   *
   * @example
   * ```typescript
   * const token = await CookieUtils.get(cookies(), "auth-token");
   * ```
   */
  static async get(
    cookieStore: ReturnType<typeof cookies>,
    name: string
  ): Promise<string | undefined> {
    const cookies = await cookieStore;
    return cookies.get(name)?.value;
  }

  /**
   * Get a specific cookie by key (convenience method)
   *
   * @param cookieStore - The cookie store from cookies()
   * @param key - Cookie key
   * @returns Cookie value or undefined if not found
   *
   * @example
   * ```typescript
   * const token = await CookieUtils.getByKey(cookies(), "auth-token");
   * const username = await CookieUtils.getByKey(cookies(), "auth-username");
   * ```
   */
  static async getByKey(
    cookieStore: ReturnType<typeof cookies>,
    key: string
  ): Promise<string | undefined> {
    return this.get(cookieStore, key);
  }

  /**
   * Delete a cookie by setting it to expire immediately
   *
   * @param response - The NextResponse object
   * @param name - Cookie name
   * @param options - Additional cookie options (optional)
   *
   * @example
   * ```typescript
   * const response = NextResponse.json(data);
   * CookieUtils.delete(response, "auth-token");
   * return response;
   * ```
   */
  static delete(
    response: NextResponse,
    name: string,
    options: CookieOptions = {}
  ): void {
    const deleteOptions = {
      ...this.DEFAULT_AUTH_OPTIONS,
      ...options,
      maxAge: 0,
      expires: new Date(0),
    };
    response.cookies.set(name, "", deleteOptions);
  }

  /**
   * Delete a cookie using Next.js cookies() API (for server actions)
   *
   * @param cookieStore - The cookie store from cookies()
   * @param name - Cookie name
   * @param options - Additional cookie options (optional)
   *
   * @example
   * ```typescript
   * await CookieUtils.deleteForAction(cookies(), "auth-token");
   * ```
   */
  static async deleteForAction(
    cookieStore: ReturnType<typeof cookies>,
    name: string,
    options: CookieOptions = {}
  ): Promise<void> {
    const cookies = await cookieStore;
    const deleteOptions = {
      ...this.DEFAULT_AUTH_OPTIONS,
      ...options,
      maxAge: 0,
      expires: new Date(0),
    };
    cookies.set(name, "", deleteOptions);
  }

  /**
   * Set authentication cookies with consistent configuration
   *
   * @param response - The NextResponse object
   * @param userId - User ID for auth-token cookie
   * @param username - Username for auth-username cookie
   * @param options - Additional options
   * @param options.requires2FA - Whether to set requires-2fa cookie
   *
   * @example
   * ```typescript
   * const response = NextResponse.json(data);
   * CookieUtils.setAuthCookies(response, userId, username, { requires2FA: true });
   * return response;
   * ```
   */
  static setAuthCookies(
    response: NextResponse,
    userId: string,
    username: string,
    options: { requires2FA?: boolean } = {}
  ): void {
    this.set(response, "auth-token", userId);
    this.set(response, "auth-username", username);

    if (options.requires2FA) {
      this.set(response, "requires-2fa", "true");
    }
  }

  /**
   * Set authentication cookies for server actions
   *
   * @param cookieStore - The cookie store from cookies()
   * @param userId - User ID for auth-token cookie
   * @param username - Username for auth-username cookie
   * @param options - Additional options
   * @param options.requires2FA - Whether to set requires-2fa cookie
   *
   * @example
   * ```typescript
   * await CookieUtils.setAuthCookiesForAction(
   *   cookies(),
   *   userId,
   *   username,
   *   { requires2FA: true }
   * );
   * ```
   */
  static async setAuthCookiesForAction(
    cookieStore: ReturnType<typeof cookies>,
    userId: string,
    username: string,
    options: { requires2FA?: boolean } = {}
  ): Promise<void> {
    await this.setForAction(cookieStore, "auth-token", userId);
    await this.setForAction(cookieStore, "auth-username", username);

    if (options.requires2FA) {
      await this.setForAction(cookieStore, "requires-2fa", "true");
    }
  }

  /**
   * Clear all authentication cookies
   *
   * @param response - The NextResponse object
   *
   * @example
   * ```typescript
   * const response = NextResponse.json(data);
   * CookieUtils.clearAuthCookies(response);
   * return response;
   * ```
   */
  static clearAuthCookies(response: NextResponse): void {
    this.delete(response, "auth-token");
    this.delete(response, "auth-username");
    this.delete(response, "requires-2fa");
    this.delete(response, "2fa-verified");
  }

  /**
   * Clear all authentication cookies for server actions
   *
   * @param cookieStore - The cookie store from cookies()
   *
   * @example
   * ```typescript
   * await CookieUtils.clearAuthCookiesForAction(cookies());
   * ```
   */
  static async clearAuthCookiesForAction(
    cookieStore: ReturnType<typeof cookies>
  ): Promise<void> {
    await this.deleteForAction(cookieStore, "auth-token");
    await this.deleteForAction(cookieStore, "auth-username");
    await this.deleteForAction(cookieStore, "requires-2fa");
    await this.deleteForAction(cookieStore, "2fa-verified");
  }
}
