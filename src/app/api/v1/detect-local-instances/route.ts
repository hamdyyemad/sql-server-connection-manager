import { NextResponse } from "next/server";
import { withErrorHandler, ApiError } from "@/backend_lib";
import { detectLocalInstances } from "@/backend_lib/handlers/detect-local-instances";

// Handler function with error handling
const detectLocalInstancesHandler = withErrorHandler(async () => {
  console.log("🔍 Debug: Local instance detection API called");

  const instances = await detectLocalInstances();

  if (instances.length > 0) {
    console.log("✅ Debug: Local instances found:", instances);
    return {
      success: true,
      data: { instances },
    };
  } else {
    console.log("❌ Debug: No local instances found");
    throw ApiError.notFound(
      "No local SQL Server instances found. Please ensure SQL Server is installed and running."
    );
  }
});

export async function GET() {
  const result = await detectLocalInstancesHandler();

  if (result.success) {
    return NextResponse.json(result.data, { status: 200 });
  } else {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
}
