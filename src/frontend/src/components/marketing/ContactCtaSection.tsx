import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Phone, MapPin, Clock, MessageCircle, ExternalLink, Mail } from 'lucide-react';
import { CONTACT_CONFIG } from '../../App';
import { useGetCompanyContactGmail } from '../../hooks/useQueries';

export function ContactCtaSection() {
  const { data: companyGmail, isLoading: gmailLoading } = useGetCompanyContactGmail();
  
  // Use fetched Gmail or fallback to CONTACT_CONFIG.email
  const displayEmail = companyGmail || CONTACT_CONFIG.email;
  
  return (
    <section id="contact" className="py-20 md:py-32 bg-gradient-to-b from-muted/30 to-background">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Ready to Power Your <span className="text-accent">Next Project?</span>
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Whether you need lubricants, mechanical packing, fluid sealants, or specialized sealing solutions — 
            we've got the products that deliver reliable performance.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
            <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-industrial">
              <CardHeader className="space-y-4 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Phone className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-xl">Call or WhatsApp</CardTitle>
                <CardDescription className="text-base space-y-3">
                  <div className="space-y-1">
                    <Button 
                      asChild 
                      variant="link" 
                      className="text-accent hover:text-accent/80 text-base font-semibold p-0 h-auto"
                    >
                      <a href={CONTACT_CONFIG.phoneLink}>{CONTACT_CONFIG.phone}</a>
                    </Button>
                    <br />
                    <Button 
                      asChild 
                      variant="link" 
                      className="text-primary hover:text-primary/80 text-sm p-0 h-auto inline-flex items-center gap-1"
                    >
                      <a 
                        href={CONTACT_CONFIG.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        WhatsApp
                      </a>
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <Button 
                      asChild 
                      variant="link" 
                      className="text-accent hover:text-accent/80 text-base font-semibold p-0 h-auto"
                    >
                      <a href={`tel:${CONTACT_CONFIG.phone2}`}>{CONTACT_CONFIG.phone2}</a>
                    </Button>
                    <br />
                    <Button 
                      asChild 
                      variant="link" 
                      className="text-primary hover:text-primary/80 text-sm p-0 h-auto inline-flex items-center gap-1"
                    >
                      <a 
                        href={CONTACT_CONFIG.whatsappUrl2}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        WhatsApp
                      </a>
                    </Button>
                  </div>
                  {!gmailLoading && displayEmail && (
                    <div className="pt-2 border-t border-border/50">
                      <Button 
                        asChild 
                        variant="link" 
                        className="text-primary hover:text-primary/80 text-sm p-0 h-auto inline-flex items-center gap-1"
                      >
                        <a 
                          href={`mailto:${displayEmail}`}
                          className="break-all"
                        >
                          <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                          {displayEmail}
                        </a>
                      </Button>
                    </div>
                  )}
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-industrial">
              <CardHeader className="space-y-4 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <MapPin className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-xl">Visit Our Store</CardTitle>
                <CardDescription className="text-base space-y-3">
                  <div>{CONTACT_CONFIG.address}</div>
                  <Button 
                    asChild 
                    variant="link" 
                    className="text-accent hover:text-accent/80 text-base font-semibold p-0 h-auto inline-flex items-center gap-1"
                  >
                    <a 
                      href={CONTACT_CONFIG.mapsUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Get Directions
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-industrial md:col-span-2 lg:col-span-1">
              <CardHeader className="space-y-4 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Clock className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-xl">Business Hours</CardTitle>
                <CardDescription className="text-base">
                  {CONTACT_CONFIG.hours}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
          
          <div className="pt-8">
            <Button 
              asChild 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold shadow-industrial-lg"
            >
              <a href={CONTACT_CONFIG.phoneLink}>
                <Phone className="mr-2 h-5 w-5" />
                Speak to Our Sealing Solutions Expert Today
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
