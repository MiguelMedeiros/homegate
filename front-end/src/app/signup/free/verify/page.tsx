"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
        <div className="mx-auto flex w-full max-w-md flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-1.5 text-sm font-medium text-brand backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand"></span>
            </span>
            Free Plan - SMS Verification
          </div>

          {/* Title */}
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            verify your phone
          </h1>
          
          {/* Subtitle */}
          <p className="mb-12 text-lg text-muted-foreground">
            {codeSent 
              ? "Enter the verification code sent to your phone"
              : "Enter your phone number to receive a verification code"
            }
          </p>

          {/* Form */}
          <div className="w-full space-y-8">
            {!codeSent ? (
              <>
                {/* Phone Number Input */}
                <div>
                  <label htmlFor="phone" className="mb-3 block text-left text-sm font-medium">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full h-14 rounded-xl border-2 border-border/50 bg-background px-4 text-sm outline-none transition-all focus:border-brand/50"
                  />
                  <p className="mt-2 text-xs text-muted-foreground text-left">
                    We&apos;ll send you a verification code via SMS
                  </p>
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

                {/* Send Code Button */}
                <Button
                  onClick={handleSendCode}
                  disabled={!phoneNumber.trim() || isLoading}
                  className="w-full h-14 bg-brand text-background text-lg hover:bg-brand/90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background/20 border-t-background"></div>
                      Sending Code...
                    </>
                  ) : (
                    <>
                      Send Verification Code
                      <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                {/* Verification Code Input */}
                <div>
                  <label htmlFor="code" className="mb-3 block text-left text-sm font-medium">
                    Verification Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="code"
                    type="text"
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={6}
                    className="w-full h-14 rounded-xl border-2 border-border/50 bg-background px-4 text-center font-mono text-2xl tracking-widest outline-none transition-all focus:border-brand/50"
                  />
                  <p className="mt-2 text-xs text-muted-foreground text-left">
                    Code sent to {phoneNumber}
                  </p>
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

                {/* Verify Button */}
                <Button
                  onClick={handleVerifyCode}
                  disabled={verificationCode.length !== 6 || isLoading}
                  className="w-full h-14 bg-brand text-background text-lg hover:bg-brand/90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background/20 border-t-background"></div>
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify Code
                      <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </Button>

                {/* Resend Code */}
                <button
                  onClick={() => {
                    setCodeSent(false);
                    setVerificationCode("");
                    setError("");
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Didn&apos;t receive the code? Send again
                </button>
              </>
            )}

            {/* Skip Verification Button (Development Only) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="pt-4">
                <button
                  onClick={handleSkipVerification}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors underline decoration-dotted underline-offset-4"
                >
                  Skip verification (development)
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
