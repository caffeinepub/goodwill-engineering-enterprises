import { Heart } from 'lucide-react';

export function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = typeof window !== 'undefined' 
    ? encodeURIComponent(window.location.hostname) 
    : 'goodwill-engineering';

  return (
    <footer className="border-t border-border/40 bg-muted/30 py-12">
      <div className="container">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center">
            <h2 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
              Goodwill Engineering Enterprises
            </h2>
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground font-semibold">
              Where Professionals Build with Confidence.
            </p>
            <p className="text-xs text-muted-foreground">
              © {currentYear} Goodwill Engineering Enterprises. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Built with</span>
            <Heart className="h-4 w-4 text-accent fill-accent" />
            <span>using</span>
            <a 
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-accent hover:text-accent/80 transition-colors"
            >
              caffeine.ai
            </a>
          </div>

          <div className="mt-4 px-6 py-3 border-2 border-border rounded-lg bg-muted/50">
            <p className="text-sm font-medium text-foreground">
              GST No.: <span className="font-semibold">33AAAFG4202C1ZD</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
