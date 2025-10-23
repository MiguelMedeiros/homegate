"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useProfile } from "@/contexts/ProfileContext";
import { useAuth } from "@/contexts/AuthContext";
import { pubkyService } from "@/lib/pubky";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// These will be replaced with real data from the signup flow

export default function BackupPage() {
  const router = useRouter();
  const { profile } = useProfile();
  const { login } = useAuth();
  const [publicKey, setPublicKey] = useState<string>("");
  const [seedPhrase, setSeedPhrase] = useState<string[]>([]);
  const [keypair, setKeypair] = useState<unknown>(null);
  const [session, setSession] = useState<unknown>(null);
  const [copied, setCopied] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Pubky Ring Dialog
  const [pubkyRingOpen, setPubkyRingOpen] = useState(false);

  // Download Encrypted File Dialog
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  // View Seed Phrase Dialog
  const [seedPhraseOpen, setSeedPhraseOpen] = useState(false);
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const [verificationWords, setVerificationWords] = useState<string[]>(Array(12).fill(""));
  const [verificationStep, setVerificationStep] = useState<"view" | "verify">("view");
  const allWordsMatch = verificationWords.every((word, index) => word.toLowerCase() === seedPhrase[index]);

  // Load Pubky data from localStorage (set by profile page) and hydrate ephemeral keypair/session from service
  useEffect(() => {
    try {
      const storedData = localStorage.getItem("pubky_signup_data");
      console.log("Loading Pubky data from localStorage:", storedData);
      if (storedData) {
        const data = JSON.parse(storedData);
        console.log("Parsed Pubky data:", data);
        setPublicKey(data.publicKey || "");
        setSeedPhrase(data.seedPhrase || []);
        // Hydrate ephemeral credentials from service cache (same-session only)
        const kp = pubkyService.getLastKeypair?.() ?? null;
        const sess = pubkyService.getLastSession?.() ?? null;
        if (kp) setKeypair(kp);
        if (sess) setSession(sess);
      } else {
        console.log("No Pubky data found in localStorage");
      }
    } catch (error) {
      console.error("Error loading Pubky data:", error);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  // Redirect if no profile or Pubky data (only after data loading is complete)
  useEffect(() => {
    if (isLoadingData) {
      console.log("Still loading data, not checking redirect conditions yet");
      return;
    }
    
    console.log("Checking redirect conditions:", {
      profile: !!profile,
      publicKey: publicKey,
      seedPhraseLength: seedPhrase.length,
      isLoadingData
    });
    
    if (!profile) {
      console.log("No profile found, redirecting to profile page");
      router.push("/signup/profile");
      return;
    }
    
    if (!publicKey || seedPhrase.length === 0) {
      console.log("No Pubky data found, redirecting to profile page");
      router.push("/signup/profile");
      return;
    }
    
    console.log("All data present, staying on backup page");
  }, [profile, publicKey, seedPhrase, router, isLoadingData]);

  // Show loading state while checking data
  if (isLoadingData || !profile || !publicKey || seedPhrase.length === 0) {
    return (
      <div className="relative flex min-h-screen flex-col bg-background">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-size-[4rem_4rem]" />
        <div className="absolute inset-0 -z-10 bg-linear-to-br from-brand/5 via-transparent to-brand/10" />
        
        <Header />
        <main className="container relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-16 mx-auto">
          <div className="flex flex-col items-center gap-6">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-brand/20 border-t-brand"></div>
            <p className="text-muted-foreground">
              {isLoadingData ? "Loading your data..." : "Redirecting..."}
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!keypair || !passwordsMatch) {
      return;
    }
    
    try {
      // Create recovery file with password
      if (!keypair || typeof keypair !== 'object') {
        throw new Error('Invalid keypair');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const recoveryFile = pubkyService.createRecoveryFile(keypair as any, password);
      
      // Create blob and download
      const blob = new Blob([recoveryFile as BlobPart], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pubky-recovery-${publicKey.slice(0, 8)}.pubky`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setDownloadOpen(false);
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error creating recovery file:", error);
      alert("Failed to create recovery file. Please try again.");
    }
  };

  const handleVerifySeedPhrase = () => {
    if (allWordsMatch) {
      setSeedPhraseOpen(false);
      setVerificationStep("view");
      setVerificationWords(Array(12).fill(""));
      setShowSeedPhrase(false);
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
            Free Plan - Signed Up!
          </div>

          {/* Title */}
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            your keys, your identity!
          </h1>
          
          {/* Subtitle */}
          <p className="mb-12 text-lg text-muted-foreground">
            Backup your seed phrase to secure your identity
          </p>

          {/* Profile Display */}
          <div className="mb-12 w-full">
            <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-brand/20 bg-card/30 p-8 backdrop-blur-sm">
              {/* Avatar */}
              {profile.avatar ? (
                <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-brand/20">
                  <Image
                    src={profile.avatar}
                    alt={profile.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-brand/20 bg-brand/10">
                  <span className="text-4xl font-bold text-brand">
                    {profile.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              
              {/* Name */}
              <div className="text-center">
                <h2 className="text-2xl font-bold">{profile.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">Your Pubky Identity</p>
              </div>

              {/* Public Key (smaller, less prominent) */}
              <details className="w-full">
                <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors text-center">
                  View Public Key
                </summary>
                <div className="mt-4 flex items-center gap-2">
                  <code className="flex-1 truncate rounded-lg bg-background/50 px-3 py-2 text-xs font-mono">
                    {publicKey}
                  </code>
                  <Button
                    onClick={handleCopy}
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                  >
                    {copied ? (
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </Button>
                </div>
              </details>
            </div>
          </div>

          {/* Backup Options */}
          <div className="w-full rounded-2xl border-2 border-brand/20 bg-card/30 p-8 backdrop-blur-sm">
            <h2 className="mb-4 text-2xl font-bold">Backup Your Identity</h2>
            <p className="mb-8 text-sm text-muted-foreground">
              Choose one or more backup methods to secure your identity
            </p>

            <div className="grid gap-4 sm:grid-cols-3">
              {/* 1. Backup with Pubky Ring */}
              <Dialog open={pubkyRingOpen} onOpenChange={setPubkyRingOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-auto flex-col gap-3 border-brand/20 bg-transparent p-6 hover:border-brand/50 hover:bg-brand/5 cursor-pointer"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10">
                      <svg className="h-6 w-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">Pubky Ring</div>
                      <div className="text-xs text-muted-foreground">Scan QR code</div>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Backup with Pubky Ring</DialogTitle>
                    <DialogDescription>
                      Scan this QR code with Pubky Ring to backup your seed phrase
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col items-center gap-6 py-6">
                    {/* QR Code Placeholder */}
                    <div className="relative w-full max-w-xs">
                      <div className="absolute inset-0 -z-10 animate-pulse rounded-2xl bg-brand/10 blur-xl" />
                      <div className="flex aspect-square items-center justify-center rounded-2xl border-2 border-brand/20 bg-card/30 p-8 backdrop-blur-sm">
                        <div className="flex flex-col items-center justify-center gap-4">
                          <svg className="h-20 w-20 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
                          </svg>
                          <span className="text-2xl font-bold text-foreground">QR Code</span>
                          <p className="text-xs text-muted-foreground text-center">
                            QR code will appear here
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-brand"></span>
                      </span>
                      <span className="text-sm text-muted-foreground">Waiting for scan...</span>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* 2. Download Encrypted File */}
              <Dialog open={downloadOpen} onOpenChange={setDownloadOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-auto flex-col gap-3 border-brand/20 bg-transparent p-6 hover:border-brand/50 hover:bg-brand/5 cursor-pointer"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10">
                      <svg className="h-6 w-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">Encrypted File</div>
                      <div className="text-xs text-muted-foreground">Download backup</div>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Download Encrypted File</DialogTitle>
                    <DialogDescription>
                      Set a password to encrypt your seed phrase backup file
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium">Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full rounded-xl border-2 border-border/50 bg-background px-4 py-2 outline-none transition-all focus:border-brand/50"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">Confirm Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        className="w-full rounded-xl border-2 border-border/50 bg-background px-4 py-2 outline-none transition-all focus:border-brand/50"
                      />
                    </div>
                    {confirmPassword && !passwordsMatch && (
                      <p className="text-sm text-red-500">Passwords do not match</p>
                    )}
                    {passwordsMatch && (
                      <p className="text-sm text-brand">✓ Passwords match</p>
                    )}
                    <Button
                      onClick={handleDownload}
                      disabled={!passwordsMatch}
                      className="w-full bg-brand text-background hover:bg-brand/90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* 3. View Seed Phrase */}
              <Dialog open={seedPhraseOpen} onOpenChange={(open) => {
                setSeedPhraseOpen(open);
                if (!open) {
                  setVerificationStep("view");
                  setShowSeedPhrase(false);
                  setVerificationWords(Array(12).fill(""));
                }
              }}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-auto flex-col gap-3 border-brand/20 bg-transparent p-6 hover:border-brand/50 hover:bg-brand/5 cursor-pointer"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10">
                      <svg className="h-6 w-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">Seed Phrase</div>
                      <div className="text-xs text-muted-foreground">View & verify</div>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {verificationStep === "view" ? "Your Seed Phrase" : "Verify Seed Phrase"}
                    </DialogTitle>
                    <DialogDescription>
                      {verificationStep === "view" 
                        ? "Write down these 12 words in order. Keep them safe and private."
                        : "Enter all 12 words to verify you wrote them down correctly"
                      }
                    </DialogDescription>
                  </DialogHeader>

                  {verificationStep === "view" ? (
                    <div className="space-y-6 py-4">
                      {!showSeedPhrase ? (
                        <div className="flex flex-col items-center gap-6 py-8">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10">
                            <svg className="h-8 w-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                          </div>
                          <div className="text-center">
                            <h3 className="mb-2 text-lg font-medium">Warning</h3>
                            <p className="text-sm text-muted-foreground">
                              Never share your seed phrase with anyone. Anyone with access to these words can control your account.
                            </p>
                          </div>
                          <Button
                            onClick={() => setShowSeedPhrase(true)}
                            className="bg-brand text-background hover:bg-brand/90 cursor-pointer"
                          >
                            I Understand, Show Seed Phrase
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-2 gap-3 rounded-xl border-2 border-brand/20 bg-card/30 p-6 backdrop-blur-sm sm:grid-cols-3">
                            {seedPhrase.map((word, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-3 rounded-lg border border-border/50 bg-background px-4 py-3"
                              >
                                <span className="text-xs text-muted-foreground">{index + 1}.</span>
                                <span className="font-mono text-sm">{word}</span>
                              </div>
                            ))}
                          </div>
                          <Button
                            onClick={() => setVerificationStep("verify")}
                            className="w-full bg-brand text-background hover:bg-brand/90 cursor-pointer"
                          >
                            I Wrote It Down, Continue to Verification
                          </Button>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-6 py-4">
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {verificationWords.map((word, index) => (
                          <div key={index}>
                            <label className="mb-1 block text-xs text-muted-foreground">{index + 1}.</label>
                            <input
                              type="text"
                              value={word}
                              onChange={(e) => {
                                const newWords = [...verificationWords];
                                newWords[index] = e.target.value;
                                setVerificationWords(newWords);
                              }}
                              placeholder={`Word ${index + 1}`}
                              className="w-full rounded-lg border-2 border-border/50 bg-background px-3 py-2 text-sm font-mono outline-none transition-all focus:border-brand/50"
                            />
                          </div>
                        ))}
                      </div>
                      {verificationWords.some(w => w) && !allWordsMatch && (
                        <p className="text-sm text-red-500">Some words don&apos;t match. Please check again.</p>
                      )}
                      {allWordsMatch && (
                        <p className="text-sm text-brand">✓ All words match!</p>
                      )}
                      <div className="flex gap-3">
                        <Button
                          onClick={() => {
                            setVerificationStep("view");
                            setVerificationWords(Array(12).fill(""));
                          }}
                          variant="outline"
                          className="flex-1 border-brand/20 hover:border-brand/50 hover:bg-brand/5 cursor-pointer"
                        >
                          Back
                        </Button>
                        <Button
                          onClick={handleVerifySeedPhrase}
                          disabled={!allWordsMatch}
                          className="flex-1 bg-brand text-background hover:bg-brand/90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          Verify & Complete
                        </Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Continue Button */}
          <div className="mt-12 w-full">
            <Button
              onClick={() => {
                // Mark as authenticated with free plan
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                login("free", publicKey, seedPhrase, keypair as any, session as any);
                // Clean up temporary data
                localStorage.removeItem("pubky_signup_data");
                // Navigate to dashboard
                router.push("/dashboard");
              }}
              size="lg"
              className="w-full bg-brand text-background text-xl hover:bg-brand/90 cursor-pointer"
            >
              You are all set! Click to go to your dashboard!
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

