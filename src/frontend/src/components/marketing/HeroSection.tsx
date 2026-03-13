import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { CONTACT_CONFIG } from "../../App";
import { TrustIndicators } from "./TrustIndicators";

export function HeroSection() {
  const scrollToProducts = () => {
    const element = document.getElementById("products");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage:
          "url(/assets/generated/gaskets-sealants-hero-bg-white-text.dim_1920x1080.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Darker overlay for better white text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60" />

      <div className="container relative z-10 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Catchphrase - White */}
          <p className="text-xl md:text-2xl font-bold text-white tracking-wide">
            Built on Goodwill.
          </p>

          {/* Main Headline - White with light green accent */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white">
            Engineering Excellence.
            <br />
            <span className="text-primary">
              Sealing Solutions Without Compromise.
            </span>
          </h1>

          {/* Subheading - White with slight opacity */}
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Your trusted source for premium lubricants, mechanical packing,
            fluid sealants, brake liners, ceramic fibre & glass products, and
            professional-grade gland packings.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              size="lg"
              onClick={scrollToProducts}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold shadow-industrial"
            >
              View Our Product Range
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-6 text-lg font-semibold"
            >
              <a href={CONTACT_CONFIG.phoneLink}>
                <Phone className="mr-2 h-5 w-5" />
                Call Now for Expert Assistance
              </a>
            </Button>
          </div>

          {/* Trust Indicators */}
          <TrustIndicators />
        </div>
      </div>
    </section>
  );
}
