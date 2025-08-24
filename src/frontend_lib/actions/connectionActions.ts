"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { apiService } from "../services";
import {
  ConnectionFormSchema,
  type ConnectionFormData,
} from "../validations/connection";
import type { DatabaseOperationConfig } from "../types/api";

export async function testConnectionAction(formData: FormData) {
  try {
    // Parse and validate form data
    const rawData = {
      server: formData.get("server") as string,
      user: formData.get("user") as string,
      password: formData.get("password") as string,
      authenticationType: formData.get("authenticationType") as
        | "windows"
        | "sql",
      connectionType: formData.get("connectionType") as "local" | "remote",
    };

    const validatedData = ConnectionFormSchema.parse(rawData);

    console.log("🔍 Server Action: Testing connection with validated data:", {
      ...validatedData,
      hasPassword: !!validatedData.password,
    });

    // Make API call to test connection
    const dbConfig: DatabaseOperationConfig = {
      server: validatedData.server,
      user: validatedData.user,
      password: validatedData.password,
      authenticationType: validatedData.authenticationType,
    };

    const response = await apiService.testConnection(dbConfig);

    if (response.success) {
      console.log("✅ Server Action: Connection successful");
      revalidatePath("/");
      return { success: true, data: response.data };
    } else {
      console.error("❌ Server Action: Connection failed:", response.error);
      return { success: false, error: response.error || "Connection failed" };
    }
  } catch (error) {
    console.error("❌ Server Action: Exception occurred:", error);

    if (error instanceof z.ZodError) {
      const errorMessage = error.issues
        .map((issue) => issue.message)
        .join(", ");
      return { success: false, error: errorMessage };
    }

    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function detectLocalInstancesAction() {
  try {
    console.log("🔍 Server Action: Detecting local instances");

    const response = await apiService.detectLocalInstances();

    if (response.success && response.data) {
      console.log(
        "✅ Server Action: Local instances detected:",
        response.data.instances
      );
      return { success: true, instances: response.data.instances };
    } else {
      console.error(
        "❌ Server Action: Local instance detection failed:",
        response.error
      );
      return {
        success: false,
        error: response.error || "No local instances found",
      };
    }
  } catch (error) {
    console.error(
      "❌ Server Action: Exception during local instance detection:",
      error
    );
    return { success: false, error: "Failed to detect local instances" };
  }
}
