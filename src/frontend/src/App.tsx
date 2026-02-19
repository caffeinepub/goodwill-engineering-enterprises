import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { SiteHeader } from './components/marketing/SiteHeader';
import { HeroSection } from './components/marketing/HeroSection';
import { AboutSection } from './components/marketing/AboutSection';
import { ProductCategoriesSection } from './components/marketing/ProductCategoriesSection';
import { WhyChooseSection } from './components/marketing/WhyChooseSection';
import { ExperienceSection } from './components/marketing/ExperienceSection';
import { ContactCtaSection } from './components/marketing/ContactCtaSection';
import { SiteFooter } from './components/marketing/SiteFooter';
import { AdminPage } from './pages/AdminPage';
import { ProductCatalogSection } from './components/store/ProductCatalogSection';
import { Toaster } from '@/components/ui/sonner';

// Shared configuration for contact information
export const CONTACT_CONFIG = {
  phone: '+919385227397',
  phone2: '+919003030750',
  phoneLink: 'tel:+919385227397',
  whatsappUrl: 'https://wa.me/919385227397',
  whatsappUrl2: 'https://wa.me/919003030750',
  whatsappNumber1: '919385227397',
  whatsappNumber2: '919003030750',
  address: '"Mufaddal Manzil" Old 162 (New 333), Linghi Chetty St., Chennai - 600001',
  email: 'gee786110@gmail.com',
  hours: '9:30 AM to 7:30 PM',
  mapsUrl: 'https://maps.app.goo.gl/JzFBzyEcZKpfbVPc6'
};

// Export View type as source of truth for navigation
export type View = 'home' | 'admin';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [currentView, setCurrentView] = useState<View>('home');

  const renderView = () => {
    switch (currentView) {
      case 'admin':
        return <AdminPage onNavigate={setCurrentView} />;
      default:
        return (
          <main>
            <HeroSection />
            <AboutSection />
            <ProductCategoriesSection />
            <WhyChooseSection />
            <ExperienceSection />
            <ProductCatalogSection />
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
