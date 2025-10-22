import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="border-b">
        <nav className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="text-xl font-semibold">Home Gate</div>
          <div className="flex items-center gap-4">
            <Button variant="ghost">About</Button>
            <Button variant="default">Get Started</Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col">
        <section className="container mx-auto flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Welcome to <span className="text-primary">Home Gate</span>
            </h1>
            <p className="text-xl text-muted-foreground sm:text-2xl">
              Your gateway to sign up and join the Pubky homeserver network
            </p>
            <p className="text-lg text-muted-foreground">
              Create your account and become part of a decentralized, secure, and
              user-owned web infrastructure.
            </p>
            <div className="flex flex-col gap-4 pt-8 sm:flex-row sm:justify-center">
              <Button size="lg" className="text-lg">
                Sign Up Now
              </Button>
              <Button size="lg" variant="outline" className="text-lg">
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Decentralized</h3>
                <p className="text-muted-foreground">
                  Join a truly distributed network where you own your data and identity.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Secure</h3>
                <p className="text-muted-foreground">
                  Built with modern cryptography to keep your information safe and private.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Easy to Use</h3>
                <p className="text-muted-foreground">
                  Simple signup process to get you connected in minutes.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Powered by Pubky Stack</p>
        </div>
      </footer>
    </div>
  );
}
