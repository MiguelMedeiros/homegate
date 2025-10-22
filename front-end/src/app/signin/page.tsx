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
import { Pubky, PublicKey, Session, AuthToken } from "@synonymdev/pubky";

export default function SignInPage() {
  const router = useRouter();
  const { signin, signinWithSession } = useAuth();
  const { setProfile } = useProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passphrase, setPassphrase] = useState("");
  const [recoveryFile, setRecoveryFile] = useState<File | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [authMethod, setAuthMethod] = useState<"recovery" | "qr">("recovery");
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
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand/5 via-transparent to-brand/10" />
      
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
          <p className="mb-8 text-lg text-muted-foreground">
            Choose your preferred sign-in method
          </p>

          {/* Authentication Method Toggle */}
          <div className="mb-8 flex rounded-lg border border-border/50 bg-card/30 p-1 backdrop-blur-sm">
            <button
              onClick={() => setAuthMethod("recovery")}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                authMethod === "recovery"
                  ? "bg-brand text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Recovery File
            </button>
            <button
              onClick={() => setAuthMethod("qr")}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                authMethod === "qr"
                  ? "bg-brand text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              QR Code
            </button>
          </div>

          {/* Authentication Content */}
          {authMethod === "recovery" ? (
            <div className="relative mb-8 w-full max-w-md">
              <div className="absolute inset-0 -z-10 animate-pulse rounded-3xl bg-brand/10 blur-2xl" />
              
              <div className="rounded-3xl border-2 border-brand/30 bg-card/50 p-8 backdrop-blur-sm transition-all hover:border-brand/50 hover:bg-card/60">
                {/* File Upload Area */}
                <div className="space-y-6">
                  {/* File Input */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Recovery File
                    </label>
                    <div 
                      className="border-2 border-dashed border-border/50 rounded-xl p-6 cursor-pointer hover:border-brand/50 transition-colors"
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
                            <p className="text-xs text-muted-foreground">Click to change file</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm font-medium">Click to upload recovery file</p>
                            <p className="text-xs text-muted-foreground">Select your .pubky file</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Passphrase Input */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Passphrase
                    </label>
                    <input
                      type="password"
                      value={passphrase}
                      onChange={(e) => setPassphrase(e.target.value)}
                      placeholder="Enter your recovery passphrase"
                      className="w-full px-4 py-3 rounded-lg border border-border/50 bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50"
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
                      <p className="text-sm text-red-400">{error}</p>
                    </div>
                  )}

                  {/* Sign In Button */}
                  <Button
                    onClick={handleSignIn}
                    disabled={!recoveryFile || !passphrase.trim() || isLoading}
                    className="w-full bg-brand hover:bg-brand/90 text-white"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Signing in...
                      </div>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative mb-8 w-full max-w-md">
              <div className="absolute inset-0 -z-10 animate-pulse rounded-3xl bg-brand/10 blur-2xl" />
              
              <div className="rounded-3xl border-2 border-brand/30 bg-card/50 p-8 backdrop-blur-sm transition-all hover:border-brand/50 hover:bg-card/60">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="mb-2 text-lg font-semibold">Sign in with Pubky Ring</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Scan the QR code with your Pubky Ring app to authenticate and grant basic access
                    </p>
                  </div>

                  {/* Pubky Auth Widget */}
                  <div className="flex justify-center">
                    <PubkyAuthWidget
                      onSuccess={handleQrAuthSuccess}
                      onError={handleQrAuthError}
                      caps="/pub/homegate.app/:r" // Request basic read access to get a Session
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

          {/* Instructions */}
          <div className="w-full max-w-md space-y-4">
            <div className="rounded-xl border border-border/50 bg-card/30 p-6 backdrop-blur-sm">
              <h3 className="mb-3 font-semibold">
                {authMethod === "recovery" ? "How to sign in with recovery file:" : "How to sign in with QR code:"}
              </h3>
              {authMethod === "recovery" ? (
                <ol className="space-y-2 text-left text-sm text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/20 text-xs font-semibold text-brand">
                      1
                    </span>
                    <span>Upload your recovery file (.pubky)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/20 text-xs font-semibold text-brand">
                      2
                    </span>
                    <span>Enter the passphrase you used when creating the recovery file</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/20 text-xs font-semibold text-brand">
                      3
                    </span>
                    <span>Click "Sign In" to restore your account</span>
                  </li>
                </ol>
              ) : (
                <ol className="space-y-2 text-left text-sm text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/20 text-xs font-semibold text-brand">
                      1
                    </span>
                    <span>Open the Pubky Ring app on your device</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/20 text-xs font-semibold text-brand">
                      2
                    </span>
                    <span>Scan the QR code displayed above</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/20 text-xs font-semibold text-brand">
                      3
                    </span>
                    <span>Approve the authentication request and grant basic access</span>
                  </li>
                </ol>
              )}
            </div>

            {/* Alternative options */}
            <div className="text-center">
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
        </div>
      </main>

      <Footer />
    </div>
  );
}

