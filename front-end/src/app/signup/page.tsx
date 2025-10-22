import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "Free",
    description: null,
    features: [
      "20MB Storage",
      "5MB Max Filesize",
      "1MB/s Speed Limit",
      null, // Empty slot for alignment
    ],
    highlighted: true,
    cta: "Get Started Free",
  },
  {
    id: "onetime",
    name: "One Time Payment",
    price: "$1 Once",
    description: null,
    features: [
      "500MB Storage",
      "20MB Max Filesize",
      "2MB/s Speed Limit",
      "Pay with Bitcoin or Credit Card",
    ],
    highlighted: false,
    cta: "Pay Once",
  },
  {
    id: "premium",
    name: "Premium",
    price: "$3/month",
    description: null,
    features: [
      "10GB Storage",
      "500MB Max Filesize",
      "5MB/s Speed Limit",
      null, // Empty slot for alignment
    ],
    highlighted: false,
    cta: "Go Premium",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$30/month",
    description: null,
    features: [
      "200GB Storage",
      "∞ Max Filesize",
      "50MB/s Speed Limit",
      null, // Empty slot for alignment
    ],
    highlighted: false,
    cta: "Go Pro",
  },
];

export default function SignUpPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand/5 via-transparent to-brand/10" />
      
      <Header 
        rightContent={
          <>
            <Link href="/signin">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Sign In
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Back
              </Button>
            </Link>
          </>
        }
      />

      {/* Main Content */}
      <main className="container relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-16 mx-auto">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center text-center">
          {/* Title */}
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            sign up
          </h1>
          
          {/* Subtitle */}
          <p className="mb-12 max-w-2xl text-lg text-muted-foreground">
            Choose your plan and create your Pubky homeserver account
          </p>

          {/* Pricing Cards */}
          <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`group relative flex flex-col overflow-hidden rounded-2xl border-2 p-6 backdrop-blur-sm transition-all hover:scale-[1.02] ${
                  plan.highlighted
                    ? "border-brand/50 bg-brand/5 shadow-lg shadow-brand/20"
                    : "border-border/50 bg-card/30 hover:border-brand/30 hover:bg-card/40"
                }`}
              >
                {/* Plan Header */}
                <div className="mb-6">
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                    {plan.name}
                  </h3>
                  <div className="text-3xl font-bold">
                    {plan.price}
                  </div>
                </div>

                {/* Features */}
                <ul className="mb-8 flex-1 space-y-3 text-left text-sm">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 min-h-[24px]">
                      {feature ? (
                        <>
                          <span className="mt-0.5 text-brand">•</span>
                          <span className="text-muted-foreground">{feature}</span>
                        </>
                      ) : (
                        <span className="invisible">•</span>
                      )}
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  className={`w-full cursor-pointer ${
                    plan.highlighted
                      ? "bg-brand text-background hover:bg-brand/90"
                      : "border-brand/20 bg-transparent hover:bg-brand/10 hover:border-brand/50"
                  }`}
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>

          {/* Terms */}
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              By signing up, I accept the{" "}
              <a href="#" className="text-brand hover:underline">
                Terms of Service
              </a>
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

