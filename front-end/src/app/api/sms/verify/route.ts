import { NextRequest, NextResponse } from "next/server";
import Prelude from "@prelude.so/sdk";

// Initialize Prelude client
const preludeClient = new Prelude({
  apiToken: process.env.PRELUDE_API_TOKEN || "",
});

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Create SMS verification
    const verification = await preludeClient.verification.create({
      target: {
        type: "phone_number",
        value: phoneNumber,
      },
    });

    return NextResponse.json({
      verificationId: verification.id,
      success: true,
    });
  } catch (error) {
    console.error("SMS verification creation error:", error);
    return NextResponse.json(
      { error: "Failed to create SMS verification" },
      { status: 500 }
    );
  }
}
