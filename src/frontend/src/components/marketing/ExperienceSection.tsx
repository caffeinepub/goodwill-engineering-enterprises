import { CheckCircle2 } from "lucide-react";

export function ExperienceSection() {
  const benefits = [
    "Fast product recommendations",
    "Clear technical explanations",
    "Quality assurance",
    "Efficient service",
    "Industry-grade supplies",
  ];

  return (
    <section className="py-20 md:py-32 bg-background relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 bg-metal-texture opacity-5" />

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            The <span className="text-primary">Goodwill</span>{" "}
            <span className="text-accent">Experience</span>
          </h2>

          <p className="text-2xl md:text-3xl font-semibold text-muted-foreground">
            Your Trusted Partner in Sealing Solutions
          </p>

          <p className="text-lg text-muted-foreground leading-relaxed">
            When you work with Goodwill Engineering Enterprises, you get:
          </p>

          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto pt-6">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-3 text-left p-4 rounded-lg bg-card border border-border/50 hover:border-accent/50 transition-colors"
              >
                <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0" />
                <span className="font-medium">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="pt-8 space-y-4">
            <p className="text-lg text-muted-foreground leading-relaxed">
              We understand that{" "}
              <span className="text-accent">reliability</span> and{" "}
              <span className="text-primary">performance</span> are critical in
              industrial applications.
            </p>
            <p className="text-xl font-semibold text-foreground">
              That's why we focus on quality, expertise, and product
              authenticity.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
