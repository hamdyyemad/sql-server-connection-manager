import { AuthStrategy, AuthResult, AuthStep } from "@/backend_lib/types/auth";
import { UserService } from "../../users/user-service";
import { createErrorObject } from "@/backend_lib/utils/responseUtils";

export class LoginStrategy implements AuthStrategy {
  constructor(private userService: UserService) {}

  async execute(data: {
    username: string;
    password: string;
  }): Promise<AuthResult> {
    try {
      const { username, password } = data;

      // Check if user exists in database using projection for better performance
      let user = await this.userService.getUserForLogin(username);

      if (!user) {
        // Check against environment variables for admin (fallback)
        if (username === process.env.ADMIN_USERNAME) {
          const adminPassword = process.env.ADMIN_PASSWORD;
          if (adminPassword && password === adminPassword) {
            // First time login - create user record based on environment variables
            const fullUser = await this.userService.createAdminUser(
              username,
              password
            );
            // Convert to projection format for consistency
            user = {
              id: fullUser.id,
              username: fullUser.username,
              passwordHash: fullUser.passwordHash,
              hasSetup2FA: fullUser.hasSetup2FA,
            };
          }
        }
      } else {
        // User exists, verify password using optimized method
        const isValidPassword =
          await this.userService.verifyPasswordForLoginProjection(
            user,
            password
          );
        if (!isValidPassword) {
          return createErrorObject("Invalid credentials");
        }
      }

      if (!user) {
        return createErrorObject("Invalid credentials");
      }

      // Check if 2FA is disabled for this user
      if (!user.is2FAEnabled) {
        // 2FA is disabled - user can login directly
        return {
          success: true,
          nextStep: AuthStep.COMPLETE, // Go directly to dashboard
          data: { userId: user.id, username: user.username },
        };
      }

      // 2FA is enabled - check if user has set it up
      const nextStep = user.hasSetup2FA
        ? AuthStep.VERIFY_2FA
        : AuthStep.SETUP_2FA;
      return {
        success: true,
        nextStep,
        data: { userId: user.id, username: user.username },
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return createErrorObject("Authentication failed");
    }
  }
}
