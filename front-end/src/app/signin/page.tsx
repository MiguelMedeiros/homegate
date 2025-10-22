"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PubkyAuthWidget } from "@/components/PubkyAuthWidget";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";
import { pubkyService, PubkyService } from "@/lib/pubky";
import { Pubky, Session, AuthToken } from "@synonymdev/pubky";

export default function SignInPage() {
  const router = useRouter();
  const { signin, signinWithSession } = useAuth();
  const { setProfile } = useProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passphrase, setPassphrase] = useState("");
  const [recoveryFile, setRecoveryFile] = useState<File | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [authMethod, setAuthMethod] = useState<"recovery" | "qr">("qr");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setRecoveryFile(file);
      setError(null);
    }
  };

  const handleQrAuthSuccess = async (publicKey: string, session?: Session, token?: AuthToken) => {
    setIsLoading(true);
    setError(null);

    try {
      // If we have a session, use it directly
      if (session) {
        // Try to load the user's profile from storage
        try {
          const profile = await pubkyService.getProfile(session);
          if (profile) {
            setProfile(profile);
          }
        } catch (profileError) {
          console.warn("Could not load profile from storage:", profileError);
          // Continue with signin even if profile loading fails
        }

        // Sign in with the session (QR auth doesn't provide keypair access)
        signinWithSession("free", publicKey, session);
        router.push("/dashboard");
        return;
      }

      // If we only have a token, we need to create a session
      if (token) {
        // For token-based auth, we'll need to create a session
        // This is a simplified approach - in a real app you might need to handle this differently
        console.log("Token-based authentication:", publicKey);
        setError("Token-based authentication not fully implemented yet. Please use recovery file method.");
      }
    } catch (error) {
      console.error("QR auth error:", error);
      setError("Failed to sign in with QR code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQrAuthError = (error: Error) => {
    console.error("QR auth error:", error);
    setError(`QR authentication failed: ${error.message}`);
  };

  const handleSignIn = async () => {
    if (!recoveryFile || !passphrase.trim()) {
      setError("Please select a recovery file and enter your passphrase");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Read the recovery file
      const arrayBuffer = await recoveryFile.arrayBuffer();
      const recoveryData = new Uint8Array(arrayBuffer);

      // Restore keypair from recovery file
      const keypair = PubkyService.restoreFromRecoveryFile(recoveryData, passphrase);
      const publicKey = keypair.publicKey.z32();

      // Create a session with the restored keypair
      const pubky = new Pubky();
      const signer = pubky.signer(keypair);
      
      const session = await signer.signin();

      // Try to load the user's profile from storage
      try {
        const profile = await pubkyService.getProfile(session);
        if (profile) {
          setProfile(profile);
        }
      } catch (profileError) {
        console.warn("Could not load profile from storage:", profileError);
        // Continue with signin even if profile loading fails
      }

      // Sign in with the restored credentials
      // We'll use 'free' as the default plan since we don't have plan info in recovery
      signin("free", publicKey, keypair, session);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Sign in error:", error);
      setError("Failed to sign in. Please check your recovery file and passphrase.");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state during hydration
  if (!isHydrated) {
    return (
      <div className="relative flex min-h-screen flex-col bg-background">
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-size-[4rem_4rem]" />
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-brand/5 via-transparent to-brand/10" />
      
      <Header 
        rightContent={
          <Link href="/">
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
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            sign in
          </h1>
          
          {/* Subtitle */}
          <p className="mb-12 text-lg text-muted-foreground">
            Scan the QR code with Pubky Ring or use your recovery file
          </p>

          {/* Authentication Method Selector */}
          <div className="mb-8 grid w-full max-w-lg grid-cols-2 gap-4">
            <button
              onClick={() => setAuthMethod("qr")}
              className={`group relative flex flex-col items-center gap-3 rounded-2xl border-2 p-6 transition-all hover:scale-[1.02] ${
                authMethod === "qr"
                  ? "border-brand/50 bg-brand/5 shadow-lg shadow-brand/20"
                  : "border-border/50 bg-card/30 hover:border-brand/30"
              }`}
            >
              <svg className={`h-10 w-10 transition-colors ${authMethod === "qr" ? "text-brand" : "text-muted-foreground"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              <div className="text-center">
                <h3 className={`mb-1 text-sm font-semibold ${authMethod === "qr" ? "text-foreground" : "text-muted-foreground"}`}>
                  Pubky Ring
                </h3>
                <p className="text-xs text-muted-foreground">
                  Scan QR code
                </p>
              </div>
              {authMethod === "qr" && (
                <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand">
                  <svg className="h-4 w-4 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>

            <button
              onClick={() => setAuthMethod("recovery")}
              className={`group relative flex flex-col items-center gap-3 rounded-2xl border-2 p-6 transition-all hover:scale-[1.02] ${
                authMethod === "recovery"
                  ? "border-brand/50 bg-brand/5 shadow-lg shadow-brand/20"
                  : "border-border/50 bg-card/30 hover:border-brand/30"
              }`}
            >
              <svg className={`h-10 w-10 transition-colors ${authMethod === "recovery" ? "text-brand" : "text-muted-foreground"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="text-center">
                <h3 className={`mb-1 text-sm font-semibold ${authMethod === "recovery" ? "text-foreground" : "text-muted-foreground"}`}>
                  Recovery File
                </h3>
                <p className="text-xs text-muted-foreground">
                  Upload .pubky file
                </p>
              </div>
              {authMethod === "recovery" && (
                <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand">
                  <svg className="h-4 w-4 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          </div>

          {/* Authentication Content */}
          {authMethod === "recovery" ? (
            <div className="relative mb-8 w-full max-w-[512px]">
              <div className="absolute inset-0 -z-10 rounded-3xl bg-card/5 blur-xl" />
              
              <div className="rounded-3xl border border-border/40 bg-card/50 p-8 backdrop-blur-sm transition-all hover:border-border/60 hover:bg-card/60">
                {/* File Upload Area */}
                <div className="space-y-8">
                  {/* File Input */}
                  <div>
                    <label className="mb-3 block text-left text-sm font-medium">
                      Recovery File <span className="text-red-500">*</span>
                    </label>
                    <div 
                      className="border-2 border-dashed border-border/50 rounded-xl p-8 cursor-pointer hover:border-brand/50 transition-all bg-background/50"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pubky"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <div className="text-center">
                        <svg className="mx-auto mb-4 h-12 w-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        {recoveryFile ? (
                          <div>
                            <p className="text-sm font-medium text-brand">{recoveryFile.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">Click to change file</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm font-medium text-foreground">Click to upload recovery file</p>
                            <p className="text-xs text-muted-foreground mt-1">Or drag and drop your .pubky file</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground text-left">
                      Upload your encrypted backup file
                    </p>
                  </div>

                  {/* Passphrase Input */}
                  <div>
                    <label className="mb-3 block text-left text-sm font-medium">
                      Passphrase <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={passphrase}
                      onChange={(e) => setPassphrase(e.target.value)}
                      placeholder="Enter your recovery passphrase"
                      className="w-full h-14 rounded-xl border-2 border-border/50 bg-background px-4 text-sm outline-none transition-all focus:border-brand/50"
                    />
                    <p className="mt-2 text-xs text-muted-foreground text-left">
                      The passphrase you used when creating the backup
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

                  {/* Sign In Button */}
                  <Button
                    onClick={handleSignIn}
                    disabled={!recoveryFile || !passphrase.trim() || isLoading}
                    className="w-full h-14 bg-brand text-background text-lg hover:bg-brand/90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background/20 border-t-background"></div>
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative mb-8 w-full max-w-[512px]">
              <div className="absolute inset-0 -z-10 rounded-3xl bg-card/5 blur-xl" />
              
              <div className="rounded-3xl border border-border/40 bg-card/50 p-8 backdrop-blur-sm transition-all hover:border-border/60 hover:bg-card/60">
                <div className="space-y-6">
                  {/* Pubky Auth Widget */}
                  <div className="flex justify-center">
                    <PubkyAuthWidget
                      open={true}
                      onSuccess={handleQrAuthSuccess}
                      onError={handleQrAuthError}
                      caps="/pub/homegate.app/:r"
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
                      <p className="text-sm text-red-400">{error}</p>
                    </div>
                  )}

                </div>
              </div>
            </div>
          )}

          {/* Alternative options - Appears for both methods */}
          <div className="w-full max-w-md text-center">
            <p className="mb-3 text-sm text-muted-foreground">
              Don&apos;t have a Pubky account yet?
            </p>
            <Link href="/signup">
              <Button variant="outline" className="w-full border-brand/20 hover:border-brand/50 hover:bg-brand/5 cursor-pointer">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

