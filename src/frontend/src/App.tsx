import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AboutSection } from "./components/marketing/AboutSection";
import { ContactCtaSection } from "./components/marketing/ContactCtaSection";
import { ExperienceSection } from "./components/marketing/ExperienceSection";
import { HeroSection } from "./components/marketing/HeroSection";
import { ProductCategoriesSection } from "./components/marketing/ProductCategoriesSection";
import { SiteFooter } from "./components/marketing/SiteFooter";
import { SiteHeader } from "./components/marketing/SiteHeader";
import { WhyChooseSection } from "./components/marketing/WhyChooseSection";
import { AdminPage } from "./pages/AdminPage";
import { CartPage } from "./pages/CartPage";
import { CatalogPage } from "./pages/CatalogPage";
import { CheckoutPage } from "./pages/CheckoutPage";

// Shared configuration for contact information
export const CONTACT_CONFIG = {
  phone: "+919385227397",
  phone2: "+919003030750",
  phoneLink: "tel:+919385227397",
  whatsappUrl: "https://wa.me/919385227397",
  whatsappUrl2: "https://wa.me/919003030750",
  whatsappNumber1: "919385227397",
  whatsappNumber2: "919003030750",
  address:
    '"Mufaddal Manzil" Old 162 (New 333), Linghi Chetty St., Chennai - 600001',
  email: "gee786110@gmail.com",
  hours: "9:30 AM to 7:30 PM",
  mapsUrl: "https://maps.app.goo.gl/JzFBzyEcZKpfbVPc6",
};

type View = "home" | "catalog" | "cart" | "checkout" | "admin";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [currentView, setCurrentView] = useState<View>("home");

  const renderView = () => {
    switch (currentView) {
      case "catalog":
        return <CatalogPage onNavigate={setCurrentView} />;
      case "cart":
        return <CartPage onNavigate={setCurrentView} />;
      case "checkout":
        return <CheckoutPage onNavigate={setCurrentView} />;
      case "admin":
        return <AdminPage onNavigate={setCurrentView} />;
      default:
        return (
          <main>
            <HeroSection />
            <AboutSection />
            <ProductCategoriesSection onNavigate={setCurrentView} />
            <WhyChooseSection />
            <ExperienceSection />
            <ContactCtaSection />
          </main>
        );
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <SiteHeader currentView={currentView} onNavigate={setCurrentView} />
        {renderView()}
        <SiteFooter />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
