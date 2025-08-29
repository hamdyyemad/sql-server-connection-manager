import { AuthStrategy, AuthResult, AuthStep } from "@/backend_lib/types/auth";
import { UserService } from "../../users/user-service";
import { verify2FACode } from "@/backend_lib/utils/2fa";
import { createErrorObject } from "@/backend_lib/utils/responseUtils";

export class Verify2FAStrategy implements AuthStrategy {
  constructor(private userService: UserService) {}

  async execute(data: {
    userId: string;
    verificationCode: string;
  }): Promise<AuthResult> {
    try {
      const { userId, verificationCode } = data;

      // Get user with projection for better performance
      const user = await this.userService.getUserForVerify2FA(userId);

      if (!user) {
        return createErrorObject("User not found");
      }

      // Check if user has 2FA setup (either permanent or temporary)
      if (!user.secret2FA && !user.tempSecret2FA) {
        return createErrorObject("2FA not setup");
      }

      let isValid = false;
      let isSetupVerification = false;

      // First check against tempSecret2FA (for setup verification)
      if (user.tempSecret2FA) {
        isValid = verify2FACode(verificationCode, user.tempSecret2FA);
        isSetupVerification = true;
      } else if (user.secret2FA) {
        // Check against permanent secret2FA (for regular verification)
        isValid = verify2FACode(verificationCode, user.secret2FA);
      }

      if (isValid) {
        if (isSetupVerification) {
          // This is a setup verification - move tempSecret2FA to secret2FA and clear temp
          await this.userService.complete2FASetup(userId, user.tempSecret2FA!);
          await this.userService.update2FAVerificationStatus(userId, true);
        } else {
          // This is a regular verification - just update verification status
          await this.userService.update2FAVerificationStatus(userId, true);
        }

        // Update last login
        await this.userService.updateLastLogin(userId);

        return {
          success: true,
          nextStep: AuthStep.COMPLETE,
          data: { userId, username: user.username },
        };
      } else {
        return createErrorObject("Invalid verification code");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return createErrorObject("2FA verification failed");
    }
  }
}
