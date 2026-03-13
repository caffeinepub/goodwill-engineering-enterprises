import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { AlertTriangle, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product, ProductCategory } from "../../backend";
import { useCart } from "../../hooks/useCart";

interface ProductCardProps {
  product: Product;
}

const categoryLabels: Record<ProductCategory, string> = {
  mechanicalPackings: "Mechanical Packings",
  fluidSealants: "Fluid Sealants",
  compressedAsbestosJointingSheets: "Asbestos Jointing Sheets",
  nonAsbestosJointingSheets: "Non-Asbestos Jointing Sheets",
  wd40Products: "WD-40 Products",
};

const getStockLabel = (stockStatus: Product["stockStatus"]) => {
  if ("inStock" in stockStatus) {
    return { label: "In Stock", variant: "default" as const };
  }
  if ("limited" in stockStatus) {
    return { label: "Limited Stock", variant: "secondary" as const };
  }
  return { label: "Out of Stock", variant: "destructive" as const };
};

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [asbestosAcknowledged, setAsbestosAcknowledged] = useState(false);

  const isAsbestos = product.category === "compressedAsbestosJointingSheets";
  const stockInfo = getStockLabel(product.stockStatus);
  const isOutOfStock = "outOfStock" in product.stockStatus;

  const handleAddToCart = () => {
    if (isAsbestos && !asbestosAcknowledged) {
      toast.error(
        "Please acknowledge the asbestos warning before adding to cart",
      );
      return;
    }

    addToCart(product.id, quantity);
    toast.success(`Added ${quantity} ${product.name} to cart`);
    setQuantity(1);
    setAsbestosAcknowledged(false);
  };

  // Get image URL from imageBlob or fallback to image field
  const imageUrl = product.imageBlob
    ? product.imageBlob.getDirectURL()
    : product.image;

  return (
    <Card className="flex flex-col h-full hover:shadow-industrial transition-shadow">
      <CardHeader className="space-y-2">
        <div className="aspect-video bg-muted rounded-lg overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Hide broken images gracefully
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
        </div>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
          <Badge variant={stockInfo.variant}>{stockInfo.label}</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {categoryLabels[product.category]}
        </p>
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {product.description}
        </p>

        {isAsbestos && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg space-y-2">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-xs text-destructive font-medium">
                Asbestos Product - Handle with care. Safety regulations apply.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox
                id={`asbestos-${product.id}`}
                checked={asbestosAcknowledged}
                onCheckedChange={(checked) =>
                  setAsbestosAcknowledged(checked as boolean)
                }
              />
              <label
                htmlFor={`asbestos-${product.id}`}
                className="text-xs leading-tight cursor-pointer"
              >
                I acknowledge the safety warning
              </label>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex-col gap-3">
        <div className="flex items-center gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={isOutOfStock}
          >
            -
          </Button>
          <Input
            type="number"
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))
            }
            className="w-16 text-center"
            min="1"
            disabled={isOutOfStock}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuantity(quantity + 1)}
            disabled={isOutOfStock}
          >
            +
          </Button>
        </div>
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="w-full"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
