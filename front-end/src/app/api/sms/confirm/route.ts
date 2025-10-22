import { NextRequest, NextResponse } from "next/server";
import Prelude from "@prelude.so/sdk";

// Initialize Prelude client
const preludeClient = new Prelude({
  apiToken: process.env.PRELUDE_API_TOKEN || "",
});

export async function POST(request: NextRequest) {
  try {
    const { verificationId, code, phoneNumber } = await request.json();

    if (!verificationId || !code) {
      return NextResponse.json(
        { error: "Verification ID and code are required" },
        { status: 400 }
      );
    }

    // Verify the SMS code
    const verification = await preludeClient.verification.check({
      code: code,
      target: {
        type: "phone_number",
        value: phoneNumber,
      },
    });

    if (verification.status === "success") {
      return NextResponse.json({
        verified: true,
        success: true,
      });
    } else {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("SMS verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify SMS code" },
      { status: 500 }
    );
  }
}
