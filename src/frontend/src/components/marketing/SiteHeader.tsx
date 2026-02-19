import { useState } from 'react';
import { Menu, Phone, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { CONTACT_CONFIG, View } from '../../App';

interface SiteHeaderProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

export function SiteHeader({ currentView, onNavigate }: SiteHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    if (currentView !== 'home') {
      onNavigate('home');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  const navLinks = [
    { label: 'Home', action: () => onNavigate('home') },
    { label: 'About', id: 'about' },
    { label: 'Products', id: 'product-catalog' },
    { label: 'Why Choose Us', id: 'why-choose' },
    { label: 'Contact', id: 'contact' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <button 
          onClick={() => onNavigate('home')}
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          <h1 className="text-lg md:text-xl font-bold text-foreground tracking-tight">
            Goodwill Engineering Enterprises
          </h1>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => {
                if (link.action) {
                  link.action();
                } else if (link.id) {
                  scrollToSection(link.id);
                }
              }}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              {link.label}
            </button>
          ))}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('admin')}
            title="Admin"
          >
            <ShieldCheck className="h-5 w-5" />
          </Button>
          <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <a href={CONTACT_CONFIG.phoneLink}>
              <Phone className="mr-2 h-4 w-4" />
              Call Now
            </a>
          </Button>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.label}>
                    <button
                      onClick={() => {
                        if (link.action) {
                          link.action();
                        } else if (link.id) {
                          scrollToSection(link.id);
                        }
                      }}
                      className="text-lg font-medium text-foreground/80 hover:text-primary transition-colors text-left py-2"
                    >
                      {link.label}
                    </button>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Button
                    variant="outline"
                    onClick={() => onNavigate('admin')}
                    className="justify-start"
                  >
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Admin
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground mt-4">
                    <a href={CONTACT_CONFIG.phoneLink}>
                      <Phone className="mr-2 h-4 w-4" />
                      Call Now
                    </a>
                  </Button>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
