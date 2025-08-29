import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/backend_lib/services/auth-admin/users/user-service";
import { TursoUserRepository } from "@/backend_lib/repositories";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, hasSetup2FA = false, isActive = true } = body;

    // Validate required fields
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Create user service instance
    const userRepo = new TursoUserRepository();
    const userService = new UserService(userRepo);

    // Create the user
    const newUser = await userService.createUser({
      username,
      password,
      hasSetup2FA,
      isActive,
    });

    // Return user info (without sensitive data)
    return NextResponse.json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
        hasSetup2FA: newUser.hasSetup2FA,
        isActive: newUser.isActive,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);

    if (error instanceof Error && error.message.includes("already exists")) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to create user" },
      { status: 500 }
    );
  }
}

// Get all users (for admin dashboard)
export async function GET(request: NextRequest) {
  try {
    const userRepo = new TursoUserRepository();
    const userService = new UserService(userRepo);

    // Get user statistics
    const stats = await userService.getUserStats();

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Error getting user stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get user statistics" },
      { status: 500 }
    );
  }
}
