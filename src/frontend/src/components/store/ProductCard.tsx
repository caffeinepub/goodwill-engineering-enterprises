import { useState } from 'react';
import { MessageCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { Product, ProductCategory } from '../../backend';
import { toast } from 'sonner';
import { CONTACT_CONFIG } from '../../App';
import { generateWhatsAppInquiryUrl } from '../../utils/whatsappOrderMessage';

interface ProductCardProps {
  product: Product;
}

const categoryLabels: Record<ProductCategory, string> = {
  mechanicalPackings: 'Mechanical Packings',
  fluidSealants: 'Fluid Sealants',
  compressedAsbestosJointingSheets: 'Asbestos Jointing Sheets',
  nonAsbestosJointingSheets: 'Non-Asbestos Jointing Sheets',
  wd40Products: 'WD-40 Products',
};

const getStockLabel = (stockStatus: Product['stockStatus']) => {
  if ('inStock' in stockStatus) {
    return { label: 'In Stock', variant: 'default' as const };
  }
  if ('limited' in stockStatus) {
    return { label: 'Limited Stock', variant: 'secondary' as const };
  }
  return { label: 'Out of Stock', variant: 'destructive' as const };
};

export function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [asbestosAcknowledged, setAsbestosAcknowledged] = useState(false);

  const isAsbestos = product.category === 'compressedAsbestosJointingSheets';
  const stockInfo = getStockLabel(product.stockStatus);
  const isOutOfStock = 'outOfStock' in product.stockStatus;

  const handleInquiry = () => {
    if (isAsbestos && !asbestosAcknowledged) {
      toast.error('Please acknowledge the asbestos warning before proceeding');
      return;
    }

    const whatsappUrl = generateWhatsAppInquiryUrl(
      CONTACT_CONFIG.whatsappNumber1,
      product,
      quantity,
      notes || undefined
    );

    window.open(whatsappUrl, '_blank');
    toast.success('Opening WhatsApp to inquire about this product');
  };

  // Get image URL from imageBlob or fallback to image field
  const imageUrl = product.imageBlob ? product.imageBlob.getDirectURL() : product.image;

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
                e.currentTarget.style.display = 'none';
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
        <p className="text-xs text-muted-foreground">{categoryLabels[product.category]}</p>
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-3">{product.description}</p>

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
                onCheckedChange={(checked) => setAsbestosAcknowledged(checked as boolean)}
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

        <div className="space-y-2">
          <Label htmlFor={`quantity-${product.id}`} className="text-sm">Quantity</Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={isOutOfStock}
            >
              -
            </Button>
            <Input
              id={`quantity-${product.id}`}
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
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
        </div>

        <div className="space-y-2">
          <Label htmlFor={`notes-${product.id}`} className="text-sm">Special Requirements (Optional)</Label>
          <Textarea
            id={`notes-${product.id}`}
            placeholder="e.g., size, specifications..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[60px] resize-none"
            disabled={isOutOfStock}
          />
        </div>
      </CardContent>

      <CardFooter>
        <Button
          onClick={handleInquiry}
          disabled={isOutOfStock}
          className="w-full bg-primary hover:bg-primary/90"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Inquire via WhatsApp
        </Button>
      </CardFooter>
    </Card>
  );
}
