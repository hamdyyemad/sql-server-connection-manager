import { AuthStrategy, AuthResult, AuthStep } from "@/backend_lib/types/auth";
import { UserService } from "../../users/user-service";
import { generate2FASecret, generateQRCode } from "@/backend_lib/utils/2fa";
import { createErrorObject } from "@/backend_lib/utils/responseUtils";

export class Setup2FAStrategy implements AuthStrategy {
  constructor(private userService: UserService) {}

  async execute(data: { userId: string }): Promise<AuthResult> {
    try {
      const { userId } = data;

      // Get user with projection for better performance
      const user = await this.userService.getUserForSetup2FA(userId);
      if (!user) {
        return createErrorObject("User not found");
      }

      // Check if user already has 2FA set up
      if (user.hasSetup2FA && user.secret2FA && user.secret2FA !== "") {
        return createErrorObject("2FA is already set up for this user");
      }

      // Generate new secret and QR code
      const secretObj = generate2FASecret();
      const qrCode = await generateQRCode(
        user.username,
        secretObj.base32,
        secretObj.otpauth_url
      );

      // Store temporary secret
      await this.userService.updateTempSecret(userId, secretObj.base32);

      return {
        success: true,
        nextStep: AuthStep.SETUP_2FA,
        data: {
          qrCode,
          secret: secretObj.base32,
          user: { userId, username: user.username },
        },
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return createErrorObject("2FA setup failed");
    }
  }
}
