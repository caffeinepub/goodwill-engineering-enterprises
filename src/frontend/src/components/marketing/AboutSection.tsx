import { CheckCircle } from 'lucide-react';

export function AboutSection() {
  const values = [
    'Reliable stock availability',
    'Genuine branded products',
    'Transparent pricing',
    'Professional guidance',
    'Customer-first service'
  ];

  return (
    <section id="about" className="py-20 md:py-32 bg-muted/30">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Built on <span className="text-primary">Trust</span>. Driven by <span className="text-accent">Quality</span>.
          </h2>
          
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p className="text-xl font-semibold text-accent">
              Serving since 1986
            </p>
            
            <p>
              At Goodwill Engineering Enterprises, we believe every industrial application deserves precision, 
              durability, and the right sealing solutions. As proud <span className="text-accent font-semibold">WD-40 distributors</span>, 
              we bring you trusted brands and quality products for all your industrial needs.
            </p>
            
            <p>
              With decades of trusted service and consistent 5-star customer feedback, we have built 
              our reputation on:
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto pt-6">
            {values.map((value) => (
              <div 
                key={value} 
                className="flex items-center gap-3 text-left p-4 rounded-lg bg-card border border-border/50"
              >
                <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
          
          <p className="text-lg text-muted-foreground leading-relaxed pt-6">
            Whether you're managing industrial machinery, maintaining equipment, or working on specialized 
            sealing applications, we ensure you get the <span className="text-primary font-semibold">right solution</span> — every time.
          </p>
        </div>
      </div>
    </section>
  );
}
