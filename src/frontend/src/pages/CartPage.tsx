import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ShoppingCart, Trash2 } from "lucide-react";
import { ProductCategory } from "../backend";
import { AsbestosWarning } from "../components/store/AsbestosWarning";
import { useCart } from "../hooks/useCart";
import { useGetAllProducts } from "../hooks/useQueries";

interface CartPageProps {
  onNavigate: (view: "home" | "catalog" | "checkout") => void;
}

export function CartPage({ onNavigate }: CartPageProps) {
  const { cart, updateQuantity, updateNotes, removeFromCart } = useCart();
  const { data: products = [], isLoading } = useGetAllProducts();

  const productMap = new Map(products.map((p) => [p.id, p]));
  const cartWithProducts = cart
    .map((item) => ({
      ...item,
      product: productMap.get(item.productId),
    }))
    .filter((item) => item.product);

  const hasAsbestosProducts = cartWithProducts.some(
    (item) =>
      item.product?.category ===
      ProductCategory.compressedAsbestosJointingSheets,
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="space-y-4">
            {["a", "b", "c"].map((k) => (
              <Skeleton key={k} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => onNavigate("catalog")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Button>
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Shopping Cart
          </h1>
          <p className="text-muted-foreground">
            Review your items before checkout
          </p>
        </div>

        {cart.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent className="space-y-4">
              <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground" />
              <h2 className="text-2xl font-semibold">Your cart is empty</h2>
              <p className="text-muted-foreground">
                Add some products to get started
              </p>
              <Button onClick={() => onNavigate("catalog")} className="mt-4">
                Browse Products
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {hasAsbestosProducts && <AsbestosWarning variant="info" />}
              {cartWithProducts.map((item) => (
                <Card key={item.productId.toString()}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                        {item.product?.image && (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {item.product?.name}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {item.product?.description}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(item.productId)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity - 1,
                                )
                              }
                            >
                              -
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(
                                  item.productId,
                                  Number.parseInt(e.target.value) || 1,
                                )
                              }
                              className="w-16 text-center"
                              min="1"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity + 1,
                                )
                              }
                            >
                              +
                            </Button>
                          </div>
                        </div>
                        <Textarea
                          placeholder="Custom size or special instructions (optional)"
                          value={item.customNotes || ""}
                          onChange={(e) =>
                            updateNotes(item.productId, e.target.value)
                          }
                          className="text-sm"
                          rows={2}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Total Items:
                      </span>
                      <span className="font-medium">
                        {cart.reduce((sum, item) => sum + item.quantity, 0)}
                      </span>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-4">
                      Final pricing will be confirmed via WhatsApp after you
                      submit your order.
                    </p>
                    <Button
                      onClick={() => onNavigate("checkout")}
                      className="w-full bg-primary hover:bg-primary/90"
                      size="lg"
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
