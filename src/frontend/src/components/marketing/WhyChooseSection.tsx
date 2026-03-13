import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Award, MessageCircle, Package, RefreshCw, Star } from "lucide-react";

export function WhyChooseSection() {
  const reasons = [
    {
      icon: Star,
      title: "Consistently High Ratings",
      description:
        "Our customers value our service, product quality, and reliability.",
    },
    {
      icon: Award,
      title: "Trusted by Professionals",
      description: "Builders and technicians rely on us for dependable supply.",
    },
    {
      icon: Package,
      title: "Comprehensive Inventory",
      description: "Everything you need — in one place.",
    },
    {
      icon: MessageCircle,
      title: "Honest & Helpful Guidance",
      description:
        "We don't just sell products — we recommend the right solutions.",
    },
    {
      icon: RefreshCw,
      title: "Repeat Customer Loyalty",
      description: "Our business grows because customers return.",
    },
  ];

  return (
    <section id="why-choose" className="py-20 md:py-32 bg-muted/30">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Why <span className="text-accent">Customers</span> Choose{" "}
            <span className="text-primary">Goodwill</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Based on trust, consistency, reliability, and long-term satisfaction
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {reasons.map((reason) => {
            const Icon = reason.icon;
            return (
              <Card
                key={reason.title}
                className="border-2 hover:border-accent/50 transition-all duration-300"
              >
                <CardHeader className="space-y-4">
                  <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
                    <Icon className="h-7 w-7 text-accent" />
                  </div>
                  <CardTitle className="text-xl">{reason.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {reason.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
