"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { API_ENDPOINTS } from "@/lib/config";
import { usePaymentWebSocket } from "@/hooks/usePaymentWebSocket";

export default function BasicPaymentPage() {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [invoice, setInvoice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate a unique session ID for this payment
  const sessionId = useRef(`payment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  const handlePaymentSuccess = useCallback(() => {
    setShowSuccess(true);
  }, []);

  // WebSocket connection - only connect after invoice is created
  const { isConnected, error: wsError } = usePaymentWebSocket({
    externalId: sessionId.current,
    onPaymentReceived: handlePaymentSuccess,
    enabled: !!invoice && !showSuccess // Only connect when we have an invoice and haven't succeeded yet
  });

  const handleContinue = () => {
    // Store payment info
    localStorage.setItem("payment_plan", "basic");
    localStorage.setItem("payment_status", "paid");
    
    // Redirect to profile
    router.push("/signup/profile");
  };

  // Create invoice on component mount
  useEffect(() => {
    const createInvoice = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(API_ENDPOINTS.invoice, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amountSat: 100,
            description: 'Homeserver Signup - Basic Plan',
            externalId: sessionId.current,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to create invoice');
        }

        setInvoice(data.invoice);
        setIsLoading(false);
      } catch (err) {
        console.error('Error creating invoice:', err);
        setError(err instanceof Error ? err.message : 'Failed to create invoice');
        setIsLoading(false);
      }
    };

    createInvoice();
  }, []);

  // Generate QR code when invoice is available
  useEffect(() => {
    if (!invoice || !canvasRef.current) return;

    try {
      QRCode.toCanvas(canvasRef.current, invoice, {
        margin: 2,
        width: 320,
        color: { light: "#ffffff", dark: "#000000" },
      });
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  }, [invoice]);

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
            Basic Plan - Lightning Payment
          </div>

          {/* Title */}
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {showSuccess ? "payment received!" : "scan to pay"}
          </h1>
          
          {/* Subtitle */}
          <p className="mb-12 text-lg text-muted-foreground">
            {showSuccess 
              ? "Thank you! Redirecting you to create your profile..." 
              : "Scan the QR code with your Lightning wallet to complete payment"
            }
          </p>

          {/* Payment Card */}
          <div className="relative mb-8 w-full max-w-md">
            {/* Glow effect */}
            <div className={`absolute inset-0 -z-10 rounded-3xl blur-2xl transition-all duration-1000 ${
              showSuccess ? "bg-green-500/30" : "bg-brand/10 animate-pulse"
            }`} />
            
            <div className={`rounded-3xl border-2 bg-card/50 p-8 backdrop-blur-sm transition-all duration-500 ${
              showSuccess 
                ? "border-green-500/50 bg-green-500/5" 
                : "border-border/40 hover:border-border/60"
            }`}>
              {/* Payment Amount */}
              <div className="mb-8">
                <p className="text-sm text-foreground/70 mb-2">Amount to pay</p>
                <p className="text-4xl font-bold text-white">₿ 100</p>
              </div>

              {/* QR Code Area with Animation */}
              <div className="relative mb-6 flex items-center justify-center">
                {/* QR Code - Fades out when paid */}
                <div className={`transition-all duration-700 ${
                  showSuccess 
                    ? "scale-0 opacity-0" 
                    : "scale-100 opacity-100"
                }`}>
                  {isLoading ? (
                    /* Loading State */
                    <div className="flex h-80 w-80 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/50 bg-background/50 p-8">
                      <div className="h-16 w-16 animate-spin rounded-full border-4 border-brand/20 border-t-brand"></div>
                      <p className="mt-4 text-sm text-muted-foreground">Generating invoice...</p>
                    </div>
                  ) : error ? (
                    /* Error State */
                    <div className="flex h-80 w-80 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-red-500/50 bg-background/50 p-8">
                      <svg className="h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="mt-4 text-sm text-red-500 text-center">{error}</p>
                      <Button
                        onClick={() => window.location.reload()}
                        variant="outline"
                        size="sm"
                        className="mt-4"
                      >
                        Try Again
                      </Button>
                    </div>
                  ) : (
                    /* QR Code */
                    <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-4">
                      <canvas 
                        ref={canvasRef} 
                        className="w-80 h-80"
                      />
                    </div>
                  )}
                </div>

                {/* Success Checkmark - Fades in when paid */}
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${
                  showSuccess 
                    ? "scale-100 opacity-100" 
                    : "scale-0 opacity-0"
                }`}>
                  <div className="flex flex-col items-center">
                    {/* Animated Checkmark Circle */}
                    <div className="relative flex h-32 w-32 items-center justify-center">
                      {/* Outer pulse rings */}
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-20"></span>
                      <span className="absolute inline-flex h-5/6 w-5/6 animate-ping rounded-full bg-green-500 opacity-30" style={{ animationDelay: "150ms" }}></span>
                      
                      {/* Main circle */}
                      <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-green-500/20 border-4 border-green-500">
                        <svg 
                          className="h-16 w-16 text-green-500 animate-in zoom-in duration-500" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          style={{ animationDelay: "200ms" }}
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={3} 
                            d="M5 13l4 4L19 7"
                            className="animate-in fade-in duration-300"
                            style={{ 
                              strokeDasharray: 100,
                              strokeDashoffset: 100,
                              animation: "draw 0.5s ease-in-out forwards 0.3s"
                            }}
                          />
                        </svg>
                      </div>
                    </div>
                    
                    <p className="mt-6 text-2xl font-bold text-green-500 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: "400ms" }}>
                      Payment Confirmed!
                    </p>
                    
                    <p className="mt-4 text-sm text-foreground/70 animate-in fade-in duration-500" style={{ animationDelay: "600ms" }}>
                      Your payment has been received successfully
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Payment Info or Continue Button */}
        {showSuccess ? (
          <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: "800ms" }}>
          <Button
            onClick={handleContinue}
            size="lg"
            className="w-full bg-brand text-background text-xl hover:bg-brand/90 cursor-pointer"
          >
            Continue to Profile
            <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Button>
        </div>
        ) : null}
      </main>

      <Footer />

      {/* Add custom CSS for checkmark animation */}
      <style jsx global>{`
        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}

