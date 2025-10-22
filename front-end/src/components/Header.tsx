import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  rightContent?: React.ReactNode;
}

export function Header({ rightContent }: HeaderProps) {
  return (
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
          {rightContent || (
            <>
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
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

