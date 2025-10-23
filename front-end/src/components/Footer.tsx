export function Footer() {
  return (
    <footer className="border-t border-border/50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2025 Homegate
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a 
              href="https://github.com/pubky/homegate" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              GitHub
            </a>
            <a href="https://pubky.org/" className="hover:text-foreground transition-colors">
              Docs
            </a>
            <a href="https://synonym.to/terms-of-service" className="hover:text-foreground transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

