"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { OTPInput } from "@/components/ui/otp";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function SmsVerifyPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendCode = async () => {
    if (!phoneNumber.trim()) {
      setError("Please enter a phone number");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // TODO: Implement actual SMS sending via API
      // await fetch('/api/sms/send', { method: 'POST', body: JSON.stringify({ phone: phoneNumber }) });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCodeSent(true);
    } catch {
      setError("Failed to send verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setError("Please enter the verification code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // TODO: Implement actual code verification via API
      // await fetch('/api/sms/verify', { method: 'POST', body: JSON.stringify({ phone: phoneNumber, code: verificationCode }) });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store verification in localStorage
      localStorage.setItem("sms_verified", "true");
      localStorage.setItem("verified_phone", phoneNumber);
      
      // Redirect to profile page
      router.push("/signup/profile");
    } catch {
      setError("Invalid verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipVerification = () => {
    // Skip SMS verification for development
    localStorage.setItem("sms_verified", "true");
    localStorage.setItem("verified_phone", "dev-skip");
    
    // Redirect to profile page
    router.push("/signup/profile");
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-size-[4rem_4rem]" />
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-brand/5 via-transparent to-brand/10" />
      
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
          {/* Title */}
          <h1 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
            {step === "phone" ? "Verify Your Phone" : "Enter Verification Code"}
          </h1>
          
          {/* Subtitle */}
          <p className="mb-8 text-muted-foreground">
            {step === "phone" 
              ? "We'll send you a verification code via SMS"
              : `We sent a 6-digit code to ${phoneNumber}`
            }
          </p>

          {/* Verification Container */}
          <div className="relative mb-8 w-full max-w-lg">
            <div className="relative rounded-3xl bg-card/30 p-12 backdrop-blur-sm transition-all hover:border-brand/50 hover:bg-card/50">
              {step === "phone" ? (
                <div className="flex flex-col items-center gap-6">
                  {/* Phone Input */}
                  <div className="w-full">
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                      placeholder="+1234567890"
                      className="w-full rounded-xl border-2 border-border/50 bg-background px-4 py-3 text-center text-lg outline-none transition-all focus:border-brand/50"
                      autoFocus
                    />
                    <p className="mt-2 text-xs text-muted-foreground text-center">
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
                  {/* Code Input */}
                  <div className="w-full">
                    <OTPInput
                      value={verificationCode}
                      onChange={setVerificationCode}
                      length={6}
                      separator={<div className="h-0.5 w-4 bg-border/50" />}
                      containerClassName="justify-center"
                      inputClassName="h-14 w-14 text-2xl"
                    />
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

                {/* Error Message */}
                {error && (
                  <div className="rounded-xl border-2 border-red-500/20 bg-red-500/5 p-4 backdrop-blur-sm">
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20">
                        <svg className="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-red-500">Error</h3>
                        <p className="mt-1 text-sm text-red-400">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
