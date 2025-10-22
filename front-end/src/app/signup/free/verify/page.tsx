"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function SMSVerificationPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [verificationId, setVerificationId] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");

  const handleSendSMS = async () => {
    if (!phoneNumber.trim()) {
      setError("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/sms/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setVerificationId(data.verificationId);
        setStep("code");
        setSuccess(true);
      } else {
        setError(data.error || "Failed to send SMS. Please try again.");
      }
    } catch (err) {
      console.error("SMS verification error:", err);
      setError("Failed to send SMS. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationId) {
      setError("Verification session expired. Please try again.");
      return;
    }

    if (!verificationCode.trim()) {
      setError("Please enter the verification code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/sms/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          verificationId, 
          code: verificationCode,
          phoneNumber: phoneNumber
        }),
      });

      const data = await response.json();

      if (response.ok && data.verified) {
        // Store verification status in localStorage
        localStorage.setItem("sms_verified", "true");
        localStorage.setItem("verified_phone", phoneNumber);
        
        // Redirect to profile creation
        router.push("/signup/free/profile");
      } else {
        setError(data.error || "Invalid verification code. Please try again.");
      }
    } catch (err) {
      console.error("Code verification error:", err);
      setError("Failed to verify code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setStep("phone");
    setVerificationCode("");
    setError("");
    setSuccess(false);
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters
    const cleaned = value.replace(/\D/g, "");
    
    // Format as international number if it doesn't start with +
    if (cleaned.length > 0 && !value.startsWith("+")) {
      return `+${cleaned}`;
    }
    
    return value;
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand/5 via-transparent to-brand/10" />
      
      <Header 
        rightContent={
          <Link href="/signup/free">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Back
            </Button>
          </Link>
        }
      />

      {/* Main Content */}
      <main className="container relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-16 mx-auto">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-1.5 text-sm font-medium text-brand backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand"></span>
            </span>
            SMS Verification
          </div>

          {/* Title */}
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {step === "phone" ? "Verify your phone" : "Enter verification code"}
          </h1>
          
          {/* Subtitle */}
          <p className="mb-12 text-lg text-muted-foreground">
            {step === "phone" 
              ? "We'll send you a verification code via SMS"
              : `We sent a code to ${phoneNumber}`
            }
          </p>

          {/* Verification Container */}
          <div className="relative mb-8 w-full max-w-md">
            <div className="absolute inset-0 -z-10 animate-pulse rounded-3xl bg-brand/10 blur-2xl" />
            <div className="relative rounded-3xl border-2 border-brand/20 bg-card/30 p-8 backdrop-blur-sm transition-all hover:border-brand/50 hover:bg-card/50">
              {step === "phone" ? (
                <div className="flex flex-col items-center gap-6">
                  {/* Phone Input */}
                  <div className="w-full">
                    <label htmlFor="phone" className="block text-sm font-medium text-muted-foreground mb-2">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                      placeholder="+1234567890"
                      className="w-full rounded-xl border-2 border-border/50 bg-background px-4 py-3 text-center text-lg outline-none transition-all focus:border-brand/50"
                      autoFocus
                    />
                    <p className="mt-2 text-xs text-muted-foreground">
                      Include country code (e.g., +1 for US)
                    </p>
                  </div>

                  {/* Send SMS Button */}
                  <Button
                    onClick={handleSendSMS}
                    disabled={!phoneNumber || isLoading}
                    className="w-full bg-brand text-background hover:bg-brand/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                        Sending SMS...
                      </>
                    ) : (
                      "Send Verification Code"
                    )}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-6">
                  {/* Success Message */}
                  {success && (
                    <div className="flex items-center gap-2 text-green-600 animate-in fade-in">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm font-medium">SMS sent successfully!</span>
                    </div>
                  )}

                  {/* Code Input */}
                  <div className="w-full">
                    <label htmlFor="code" className="block text-sm font-medium text-muted-foreground mb-2">
                      Verification Code
                    </label>
                    <input
                      id="code"
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="123456"
                      className="w-full rounded-xl border-2 border-border/50 bg-background px-4 py-3 text-center text-2xl font-mono outline-none transition-all focus:border-brand/50"
                      autoFocus
                      maxLength={6}
                    />
                    <p className="mt-2 text-xs text-muted-foreground">
                      Enter the 6-digit code from your SMS
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex w-full gap-3">
                    <Button
                      onClick={handleResendCode}
                      variant="outline"
                      className="flex-1 border-brand/20 hover:border-brand/50 hover:bg-brand/5"
                    >
                      Resend Code
                    </Button>
                    <Button
                      onClick={handleVerifyCode}
                      disabled={!verificationCode || verificationCode.length !== 6 || isLoading}
                      className="flex-1 bg-brand text-background hover:bg-brand/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                          Verifying...
                        </>
                      ) : (
                        "Verify Code"
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mt-4 flex items-center gap-2 text-red-500 animate-in fade-in">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">{error}</span>
                </div>
              )}
            </div>
          </div>

          {/* Help Text */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Having trouble? Check your SMS messages or try resending the code.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
