"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// Simple math captcha generator
function generateCaptcha() {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operators = ["+", "-", "×"];
  const operator = operators[Math.floor(Math.random() * operators.length)];
  
  let answer: number;
  switch (operator) {
    case "+":
      answer = num1 + num2;
      break;
    case "-":
      answer = num1 - num2;
      break;
    case "×":
      answer = num1 * num2;
      break;
    default:
      answer = num1 + num2;
  }
  
  return {
    question: `${num1} ${operator} ${num2}`,
    answer,
  };
}

// Hook to check if we're on the client
function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export default function FreeSignUpPage() {
  const isClient = useIsClient();
  const [captcha, setCaptcha] = useState<{ question: string; answer: number }>(() => generateCaptcha());
  const [userAnswer, setUserAnswer] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleVerify = () => {
    const answer = parseInt(userAnswer);
    if (answer === captcha.answer) {
      setIsVerified(true);
      setShowError(false);
    } else {
      setShowError(true);
      // Generate new captcha after wrong answer
      setTimeout(() => {
        setCaptcha(generateCaptcha());
        setUserAnswer("");
        setShowError(false);
      }, 2000);
    }
  };

  const handleRefresh = () => {
    setCaptcha(generateCaptcha());
    setUserAnswer("");
    setShowError(false);
    setIsVerified(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && userAnswer && !isVerified) {
      handleVerify();
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-size-[4rem_4rem]" />
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-brand/5 via-transparent to-brand/10" />
      
      <Header 
        rightContent={
          <Link href="/signup">
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
            Free Plan
          </div>

          {/* Title */}
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Prove you are human
          </h1>
          
          {/* Subtitle */}
          <p className="mb-12 text-lg text-muted-foreground">
            Complete the math challenge below to continue
          </p>

          {/* Captcha Container */}
          <div className="relative mb-8 w-full max-w-md">
            {/* <div className="absolute inset-0 -z-10 animate-pulse rounded-3xl bg-brand/10 blur-2xl" /> */}
            <div className="relative rounded-3xl border-2 border-brand/20 bg-card/30 p-8 backdrop-blur-sm transition-all hover:border-brand/50 hover:bg-card/50">
              {!isClient ? (
                <div className="flex flex-col items-center gap-6 py-8">
                  <div className="h-16 w-16 animate-spin rounded-full border-4 border-brand/20 border-t-brand"></div>
                  <p className="text-muted-foreground">Loading challenge...</p>
                </div>
              ) : !isVerified ? (
                <div className="flex flex-col items-center gap-6">
                  {/* Captcha Question */}
                  <div className="flex flex-col items-center gap-4">
                    <p className="text-sm text-muted-foreground">What is:</p>
                    <div className="text-5xl font-bold text-brand" suppressHydrationWarning>
                      {captcha.question}
                    </div>
                  </div>

                  {/* Input */}
                  <div className="w-full">
                    <input
                      type="number"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter your answer"
                      className={`w-full rounded-xl border-2 bg-background px-4 py-3 text-center text-2xl outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                        showError
                          ? "border-red-500/50 text-red-500"
                          : "border-border/50 text-foreground focus:border-brand/50"
                      }`}
                      autoFocus
                    />
                    {showError && (
                      <p className="mt-2 text-sm text-red-500 animate-in fade-in">
                        Incorrect answer. Try again!
                      </p>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex w-full gap-3">
                    <Button
                      onClick={handleRefresh}
                      variant="outline"
                      className="flex-1 border-brand/20 hover:border-brand/50 hover:bg-brand/5"
                    >
                      <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Refresh
                    </Button>
                    <Button
                      onClick={handleVerify}
                      disabled={!userAnswer}
                      className="flex-1 bg-brand text-background hover:bg-brand/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Verify
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-6">
                  {/* Success Icon */}
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand/20 animate-in zoom-in">
                    <svg className="h-10 w-10 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="mb-2 text-2xl font-bold text-brand">Done!</h3>
                    <p className="text-muted-foreground">You&apos;re ready to continue</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Continue Button - Only shows after verification */}
          {isVerified && (
            <Link href="/signup/free/verify" className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4">
              <Button
                size="sm"
                className="cursor-pointer w-full bg-brand text-background text-sm hover:bg-brand/90 h-10"
              >
                Next
              </Button>
            </Link>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

