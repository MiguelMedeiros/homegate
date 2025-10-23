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
      </nav>
    </header>
  );
}

