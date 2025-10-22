import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      {/* Subtle grid pattern background */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand/5 via-transparent to-brand/10" />
      
      <Header />

      {/* Hero Section */}
      <main className="container relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-16 m-auto">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-1.5 text-sm font-medium text-brand backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand"></span>
            </span>
            Early Access - Be Among the First
          </div>

          {/* Main Title */}
          <h1 className="mb-6 text-6xl font-bold tracking-tight sm:text-7xl lg:text-8xl">
            Your Gateway to 
            <br />
            <span className="bg-gradient-to-r from-brand via-brand/80 to-brand/60 bg-clip-text text-transparent">
              Freedom
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mb-12 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Create your own key and store your data securely. 
            No big tech, no surveillance, just you in control.
          </p>

          {/* Action Buttons */}
          <div className="flex w-full max-w-2xl flex-col gap-6 sm:flex-row sm:gap-6">
            {/* Sign Up Button (Primary CTA) */}
            <Link href="/signup" className="group flex-1">
              <div className="relative overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-brand/20 via-brand/10 to-brand/20 opacity-0 transition-opacity group-hover:opacity-100" />
                <Button
                  size="lg"
                  className="h-24 w-full rounded-2xl bg-brand text-2xl font-semibold text-background shadow-lg shadow-brand/20 transition-all hover:scale-[1.02] hover:bg-brand/90 hover:shadow-xl hover:shadow-brand/30 sm:h-28 sm:text-3xl"
                >
                  <div className="flex flex-col items-center gap-2">
                    <span>Get Started</span>
                    <span className="text-sm font-normal text-background/70 sm:text-base">
                      Join the revolution
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
                  className="h-24 w-full rounded-2xl border-2 border-border/50 bg-card/50 text-2xl font-semibold backdrop-blur-sm transition-all hover:scale-[1.02] hover:border-brand/50 hover:bg-brand/5 sm:h-28 sm:text-3xl cursor-pointer"
                >
                  <div className="flex flex-col items-center gap-2">
                    <span>Welcome Back</span>
                    <span className="text-sm font-normal text-muted-foreground sm:text-base">
                      Access your homeserver
                    </span>
                  </div>
                </Button>
              </div>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
