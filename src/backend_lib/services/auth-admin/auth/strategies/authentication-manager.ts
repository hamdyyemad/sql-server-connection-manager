import {
  AuthStep,
  AuthResult,
  AuthStrategy,
  AuthData,
} from "@/backend_lib/types/auth";
import { LoginStrategy } from "./login-strategy";
import { Setup2FAStrategy } from "./setup-2FA-strategy";
import { Verify2FAStrategy } from "./verify-2FA-strategy";
import { UserService } from "../../users/user-service";
import { TursoUserRepository } from "@/backend_lib/repositories";

export class AuthenticationManager {
  private userService: UserService;
  private strategies: Map<AuthStep, AuthStrategy>;

  constructor() {
    const userRepo = new TursoUserRepository();
    this.userService = new UserService(userRepo);
    this.strategies = new Map();
    this.strategies.set(AuthStep.LOGIN, new LoginStrategy(this.userService));
    this.strategies.set(
      AuthStep.SETUP_2FA,
      new Setup2FAStrategy(this.userService)
    );
    this.strategies.set(
      AuthStep.VERIFY_2FA,
      new Verify2FAStrategy(this.userService)
    );
  }

  async executeStep(step: AuthStep, data: AuthData): Promise<AuthResult> {
    const strategy = this.strategies.get(step);
    if (!strategy) {
      return { success: false, error: "Invalid authentication step" };
    }
    return await strategy.execute(data);
  }

  async determineInitialStep(userId?: string): Promise<AuthStep> {
    if (!userId) return AuthStep.LOGIN;

    // Use projection for better performance - need hasSetup2FA and is2FAEnabled fields
    const userStatus = await this.userService.getUserStatus(userId);
    if (!userStatus) return AuthStep.LOGIN;

    // Check if 2FA is disabled for this user
    if (!userStatus.is2FAEnabled) {
      return AuthStep.COMPLETE; // Go directly to dashboard
    }

    return userStatus.hasSetup2FA ? AuthStep.VERIFY_2FA : AuthStep.SETUP_2FA;
  }
}
