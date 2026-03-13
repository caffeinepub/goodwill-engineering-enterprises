import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Disc, Droplet, Layers, Package, Shield, Wrench } from "lucide-react";

export function ProductCategoriesGrid() {
  const categories = [
    {
      icon: Droplet,
      title: "Lubricants",
      description:
        "High-performance industrial lubricants for machinery, equipment, and automotive applications.",
    },
    {
      icon: Package,
      title: "Mechanical Packing",
      description:
        "Premium mechanical packing solutions for pumps, valves, and rotating equipment.",
    },
    {
      icon: Shield,
      title: "Fluid Sealants",
      description:
        "Advanced fluid sealing compounds for leak-proof, high-grade industrial and domestic applications.",
    },
    {
      icon: Disc,
      title: "Brake Liners",
      description:
        "Durable, heat-resistant brake liners engineered for safety and reliable stopping power.",
    },
    {
      icon: Layers,
      title: "Ceramic Fibre & Glass Products",
      description:
        "High-temperature insulation materials including ceramic fibre blankets, boards, and glass products.",
    },
    {
      icon: Wrench,
      title: "Gland Packings",
      description:
        "Professional-grade gland packing materials for effective sealing in pumps and valves.",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <Card
            key={category.title}
            className="group hover:shadow-industrial transition-all duration-300 hover:border-primary/50 cursor-pointer"
          >
            <CardHeader className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Icon className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="text-xl">{category.title}</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                {category.description}
              </CardDescription>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}
