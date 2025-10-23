import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const plans = [
  {
    id: "free/verify",
    name: "Free",
    price: "Free",
    description: "Get started for free",
    features: [
      "500MB Storage",
      "20MB Max Filesize", 
      "5MB/s Speed Limit",
    ],
    highlighted: false,
    cta: "Get Started Free",
  },
  {
    id: "basic",
    name: "Basic",
    price: "₿ 100",
    description: "Most popular choice",
    features: [
      "500MB Storage",
      "50MB Max Filesize",
      "10MB/s Speed Limit", 
      "Priority support",
    ],
    highlighted: true,
    cta: "Pay Once",
    badge: "RECOMMENDED",
  },
  {
    id: "pro",
    name: "Pro",
    price: "₿ 1000",
    description: "For power users & creators",
    features: [
      "5GB Storage",
      "500MB Max Filesize",
      "Unlimited Speed",
      "Priority indexing for content discovery",
    ],
    highlighted: false,
    cta: "Coming Soon",
  },
];

export default function SignUpPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-size-[4rem_4rem]" />
      
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
          {/* Enhanced Title Section */}
          <div className="mb-16">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Choose Your Plan
            </h1>
            
            <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Select the perfect plan for your needs and create your Pubky homeserver account
            </p>
          </div>

          {/* Enhanced Pricing Cards */}
          <div className="grid w-full gap-8 sm:grid-cols-2 lg:grid-cols-3 group">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`group relative flex flex-col overflow-hidden rounded-3xl border-2 backdrop-blur-sm transition-all duration-300 ${
                  plan.highlighted
                    ? "border-brand/60 bg-brand/5 p-12 scale-110 group-hover:border-border/30 hover:border-brand/60"
                    : "border-border/30 bg-card/40 hover:border-brand/40 hover:bg-card/50 p-6 scale-95"
                }`}
              >
                {/* Popular Badge */}
                {plan.badge && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="inline-flex items-center rounded-full bg-brand px-3 py-1 text-xs font-semibold text-background">
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="mb-6 text-center">
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {plan.name}
                  </h3>
                  <div className="text-4xl font-bold tracking-tight">
                    {plan.price}
                  </div>
                  {plan.description && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="mb-8 flex-1 space-y-4 text-left">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className={`mt-1 flex h-5 w-5 items-center justify-center rounded-full ${
                        plan.highlighted 
                          ? "bg-brand/20 text-brand" 
                          : "bg-muted/50 text-muted-foreground"
                      }`}>
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                {plan.id === "pro" ? (
                  <Button
                    className="w-full cursor-not-allowed opacity-50"
                    variant="outline"
                    size="lg"
                    disabled
                  >
                    {plan.cta}
                  </Button>
                ) : (
                  <Link href={`/signup/${plan.id}`} className="w-full">
                    <Button
                      className={`w-full cursor-pointer transition-all duration-200 ${
                        plan.highlighted
                          ? "bg-brand text-background hover:bg-brand/90"
                          : "border-brand/30 bg-transparent hover:bg-brand/10 hover:border-brand/50"
                      }`}
                      variant={plan.highlighted ? "default" : "outline"}
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

