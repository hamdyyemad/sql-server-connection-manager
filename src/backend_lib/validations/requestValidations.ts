/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
// Debug functions are now automatically handled by console override
import { createErrorObject, createSuccessObject } from "../utils/responseUtils";

export async function validatePostRequest(
  request: NextRequest
): Promise<{ success: boolean; error: string; body?: any }> {
  try {
    // GET requests don't have a body, so we can't use database middleware
    if (request.method === "GET") {
      console.error("GET requests are not supported by database middleware");
      return createErrorObject(
        "Database middleware only supports POST requests"
      );
    }

    // Check if request has a body
    const contentLength = request.headers.get("content-length");
    if (!contentLength || parseInt(contentLength) === 0) {
      console.error("Request body is empty");
      return createErrorObject("Request body is required");
    }

    // Check if request's body is empty after trimming
    const bodyText = await request.text();
    console.log("Raw request body:", bodyText);

    if (!bodyText || bodyText.trim() === "") {
      console.error("Request body is empty after text conversion");
      return createErrorObject("Request body is empty");
    }

    // Parse JSON body
    const body = JSON.parse(bodyText);
    console.log("Request body:", body);

    return {
      ...createSuccessObject(),
      body,
    };
  } catch (jsonError) {
          console.error("Failed to parse JSON body:", jsonError);
      console.error("JSON error details:", {
      message: (jsonError as Error).message,
      stack: (jsonError as Error).stack,
    });
    return createErrorObject("Invalid JSON in request body");
  }
}
