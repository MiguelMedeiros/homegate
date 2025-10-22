import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      {/* Subtle grid pattern background */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand/5 via-transparent to-brand/10" />
      
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm">
        <nav className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <Image 
              src="/pubky-logo.svg" 
              alt="Pubky Logo" 
              width={109} 
              height={36}
              className="h-8 w-auto"
              priority
            />
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/about">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                About
              </Button>
            </Link>
            <Link href="/docs">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Docs
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-16 m-auto">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-1.5 text-sm font-medium text-brand backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand"></span>
            </span>
            Beta - Join the Pubky Network
          </div>

          {/* Main Title */}
          <h1 className="mb-6 text-6xl font-bold tracking-tight sm:text-7xl lg:text-8xl">
            Your Gateway to
            <br />
            <span className="bg-gradient-to-r from-brand via-brand/80 to-brand/60 bg-clip-text text-transparent">
              Decentralized Web
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mb-12 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Sign up for a Pubky homeserver account and take control of your digital identity. 
            Open, secure, and truly yours.
          </p>

          {/* Action Buttons */}
          <div className="flex w-full max-w-2xl flex-col gap-6 sm:flex-row sm:gap-6">
            {/* Sign Up Button (Primary CTA) */}
            <Link href="/signup" className="group flex-1">
              <div className="relative overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-brand/20 via-brand/10 to-brand/20 opacity-0 transition-opacity group-hover:opacity-100" />
                <Button
                  size="lg"
                  className="h-52 w-full rounded-2xl bg-brand text-2xl font-semibold text-background shadow-lg shadow-brand/20 transition-all hover:scale-[1.02] hover:bg-brand/90 hover:shadow-xl hover:shadow-brand/30 sm:h-64 sm:text-3xl"
                >
                  <div className="flex flex-col items-center gap-2">
                    <span>Sign Up</span>
                    <span className="text-sm font-normal text-background/70 sm:text-base">
                      Create your account
                    </span>
                  </div>
                </Button>
              </div>
            </Link>

            {/* Sign In Button (Secondary CTA) */}
            <Link href="/signin" className="group flex-1">
              <div className="relative overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-brand/10 via-brand/5 to-brand/10 opacity-0 transition-opacity group-hover:opacity-100" />
                <Button
                  variant="outline"
                  size="lg"
                  className="h-52 w-full rounded-2xl border-2 border-border/50 bg-card/50 text-2xl font-semibold backdrop-blur-sm transition-all hover:scale-[1.02] hover:border-brand/50 hover:bg-brand/5 sm:h-64 sm:text-3xl cursor-pointer"
                >
                  <div className="flex flex-col items-center gap-2">
                    <span>Sign In</span>
                    <span className="text-sm font-normal text-muted-foreground sm:text-base">
                      Already have an account
                    </span>
                  </div>
                </Button>
              </div>
            </Link>
          </div>

          {/* Features */}
          <div className="mt-20 grid w-full max-w-4xl gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-border/50 bg-card/30 p-6 backdrop-blur-sm transition-all hover:border-brand/30 hover:bg-card/50">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10">
                <svg className="h-5 w-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold">Secure</h3>
              <p className="text-sm text-muted-foreground">
                End-to-end encrypted. Your data stays yours.
              </p>
            </div>

            <div className="rounded-xl border border-border/50 bg-card/30 p-6 backdrop-blur-sm transition-all hover:border-brand/30 hover:bg-card/50">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10">
                <svg className="h-5 w-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold">Decentralized</h3>
              <p className="text-sm text-muted-foreground">
                No single point of control or failure.
              </p>
            </div>

            <div className="rounded-xl border border-border/50 bg-card/30 p-6 backdrop-blur-sm transition-all hover:border-brand/30 hover:bg-card/50">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10">
                <svg className="h-5 w-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold">Fast</h3>
              <p className="text-sm text-muted-foreground">
                Lightning-quick setup and performance.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2025 Home Gate. Powered by{" "}
              <a href="https://pubky.tech" className="text-brand hover:underline" target="_blank" rel="noopener noreferrer">
                Pubky Stack
              </a>
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
