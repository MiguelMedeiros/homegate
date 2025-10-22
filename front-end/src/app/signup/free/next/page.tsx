"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Mock public key (will be replaced with real one later)
const MOCK_PUBLIC_KEY = "4snwyct86m383rsduhw5xgcxpw7c63j3pq8x4ycqikxgik8y64ro";

// Mock seed phrase (will be generated later)
const MOCK_SEED_PHRASE = [
  "abandon", "ability", "able", "about", "above", "absent",
  "absorb", "abstract", "absurd", "abuse", "access", "accident"
];

export default function FreeNextPage() {
  const [publicKey] = useState(MOCK_PUBLIC_KEY);
  const [copied, setCopied] = useState(false);

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
  const allWordsMatch = verificationWords.every((word, index) => word.toLowerCase() === MOCK_SEED_PHRASE[index]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    // TODO: Implement actual download logic
    console.log("Downloading encrypted file...");
    setDownloadOpen(false);
    setPassword("");
    setConfirmPassword("");
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
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand/5 via-transparent to-brand/10" />
      
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
            Save your public key and backup your seed phrase to secure your identity
          </p>

          {/* Public Key Display */}
          <div className="mb-12 w-full">
            <label className="mb-3 block text-left text-sm font-medium text-muted-foreground">
              Your Public Key
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={publicKey}
                readOnly
                className="flex-1 h-14 rounded-xl border-2 border-border/50 bg-card/30 px-4 text-sm font-mono backdrop-blur-sm cursor-default focus:outline-none focus:border-brand/50"
              />
              <Button
                onClick={handleCopy}
                className="h-13 bg-brand text-background hover:bg-brand/90 cursor-pointer"
              >
                {copied ? (
                  <>
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </>
                )}
              </Button>
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
                            {MOCK_SEED_PHRASE.map((word, index) => (
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
            <Link href="/">
              <Button
                size="lg"
                className="w-full bg-brand text-background text-xl hover:bg-brand/90 cursor-pointer"
              >
                Create your profile and start using Pubky!
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

