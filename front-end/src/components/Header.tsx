import Link from "next/link";
import Image from "next/image";

interface HeaderProps {
  rightContent?: React.ReactNode;
}

export function Header({ rightContent }: HeaderProps) {
  return (
    <header className="border-b border-border/50 backdrop-blur-sm">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex flex-1 items-center gap-3 transition-opacity hover:opacity-80">
          <Image 
            src="/homegate_with.svg" 
            alt="Homegate Logo" 
            width={250} 
            height={75}
            className="h-10 w-auto"
            priority
          />
        </Link>
        {rightContent}
      </nav>
    </header>
  );
}

