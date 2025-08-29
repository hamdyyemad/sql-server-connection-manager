import { NextResponse } from "next/server";

export function createErrorObject(error: string) {
  return {
    success: false,
    error,
  };
}

export function createSuccessObject(data?: unknown, message?: string) {
  return {
    success: true,
    error: "",
    data,
    message,
  };
}

export function validateRequired(
  data: Record<string, unknown>,
  requiredFields: string[]
): string | true {
  for (const field of requiredFields) {
    if (!data[field]) {
      return `${field} is required`;
    }
  }
  return true;
}
