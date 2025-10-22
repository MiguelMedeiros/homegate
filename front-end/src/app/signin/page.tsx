import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function SignInPage() {
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
          <p className="mb-12 text-lg text-muted-foreground">
            Scan the QR code with Pubky Ring to sign in
          </p>

          {/* QR Code Container */}
          <div className="relative mb-8 w-full max-w-md">
            <div className="absolute inset-0 -z-10 animate-pulse rounded-3xl bg-brand/10 blur-2xl" />
            
            <div className="rounded-3xl border-2 border-brand/30 bg-card/50 p-8 backdrop-blur-sm transition-all hover:border-brand/50 hover:bg-card/60">
              {/* QR Code Placeholder */}
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl border-4 border-border/30 bg-background p-8">
                <div className="flex h-full w-full items-center justify-center">
                  {/* Placeholder QR Code */}
                  <div className="relative h-full w-full">
                    {/* This will be replaced with actual QR code */}
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <svg 
                          className="mx-auto mb-4 h-16 w-16 text-brand" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" 
                          />
                        </svg>
                        <p className="text-2xl font-semibold">qrcode</p>
                        <p className="mt-2 text-sm">
                          QR code will appear here
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Status indicator */}
              <div className="mt-6 flex items-center justify-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-brand"></span>
                </span>
                <span className="text-sm text-muted-foreground">
                  Waiting for scan...
                </span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="w-full max-w-md space-y-4">
            <div className="rounded-xl border border-border/50 bg-card/30 p-6 backdrop-blur-sm">
              <h3 className="mb-3 font-semibold">How to sign in:</h3>
              <ol className="space-y-2 text-left text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/20 text-xs font-semibold text-brand">
                    1
                  </span>
                  <span>Open Pubky Ring on your mobile device</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/20 text-xs font-semibold text-brand">
                    2
                  </span>
                  <span>Tap on &ldquo;Scan QR Code&rdquo; or the camera icon</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/20 text-xs font-semibold text-brand">
                    3
                  </span>
                  <span>Point your camera at the QR code above</span>
                </li>
              </ol>
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

