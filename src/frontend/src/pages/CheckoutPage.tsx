import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CONTACT_CONFIG } from "../App";
import { ProductCategory } from "../backend";
import { AsbestosWarning } from "../components/store/AsbestosWarning";
import { useCart } from "../hooks/useCart";
import { useGetAllProducts, useSubmitWhatsAppOrder } from "../hooks/useQueries";
import {
  formatWhatsAppOrderMessage,
  generateWhatsAppUrl,
} from "../utils/whatsappOrderMessage";

interface CheckoutPageProps {
  onNavigate: (view: "home" | "catalog" | "cart") => void;
}

export function CheckoutPage({ onNavigate }: CheckoutPageProps) {
  const { cart, clearCart } = useCart();
  const { data: products = [] } = useGetAllProducts();
  const submitOrder = useSubmitWhatsAppOrder();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [remarks, setRemarks] = useState("");
  const [asbestosAcknowledged, setAsbestosAcknowledged] = useState(false);

  const productMap = new Map(products.map((p) => [p.id, p]));
  const hasAsbestosProducts = cart.some(
    (item) =>
      productMap.get(item.productId)?.category ===
      ProductCategory.compressedAsbestosJointingSheets,
  );

  const validateForm = () => {
    if (!fullName.trim()) {
      toast.error("Please enter your full name");
      return false;
    }
    if (!phone.trim()) {
      toast.error("Please enter your phone number");
      return false;
    }
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return false;
    }
    if (!deliveryAddress.trim()) {
      toast.error("Please enter your delivery address");
      return false;
    }
    if (hasAsbestosProducts && !asbestosAcknowledged) {
      toast.error(
        "Please acknowledge the asbestos product warning before proceeding",
      );
      return false;
    }
    return true;
  };

  const handleWhatsAppOrder = async (whatsappNumber: string) => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      // Convert cart items to backend format
      const cartItems = cart.map((item) => ({
        productId: item.productId,
        quantity: BigInt(item.quantity),
        customNotes: item.customNotes || undefined,
      }));

      // Submit order to backend
      await submitOrder.mutateAsync({
        cartItems,
        whatsappNumber,
      });

      // Generate WhatsApp message
      const message = formatWhatsAppOrderMessage(
        {
          fullName,
          phone,
          email,
          deliveryAddress,
          companyName: companyName || undefined,
          remarks: remarks || undefined,
        },
        cart,
        products,
      );

      const whatsappUrl = generateWhatsAppUrl(whatsappNumber, message);

      // Open WhatsApp
      window.open(whatsappUrl, "_blank");

      // Clear cart and show success
      clearCart();
      toast.success("Order submitted! Opening WhatsApp...");

      // Navigate back to home after a short delay
      setTimeout(() => {
        onNavigate("home");
      }, 2000);
    } catch (error) {
      console.error("Failed to submit order:", error);
      toast.error("Failed to submit order. Please try again.");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <Card className="text-center py-16 max-w-md mx-auto">
            <CardContent className="space-y-4">
              <h2 className="text-2xl font-semibold">Your cart is empty</h2>
              <p className="text-muted-foreground">
                Add some products before checking out
              </p>
              <Button onClick={() => onNavigate("catalog")} className="mt-4">
                Browse Products
              </Button>
            </CardContent>
          </Card>
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
            onClick={() => onNavigate("cart")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Button>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Checkout</h1>
          <p className="text-muted-foreground">
            Complete your order details to send via WhatsApp
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {hasAsbestosProducts && (
              <div className="mb-6">
                <AsbestosWarning variant="warning" />
                <div className="flex items-start space-x-2 mt-4 p-4 border rounded-lg bg-muted/50">
                  <Checkbox
                    id="asbestos-acknowledge"
                    checked={asbestosAcknowledged}
                    onCheckedChange={(checked) =>
                      setAsbestosAcknowledged(checked as boolean)
                    }
                  />
                  <label
                    htmlFor="asbestos-acknowledge"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I acknowledge that I have read and understood the safety
                    warnings for asbestos products and will handle them
                    according to safety regulations.
                  </label>
                </div>
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryAddress">Delivery Address *</Label>
                  <Textarea
                    id="deliveryAddress"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter complete delivery address"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name (Optional)</Label>
                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Your company name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="remarks">
                    Remarks / Special Instructions (Optional)
                  </Label>
                  <Textarea
                    id="remarks"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Any special requirements or instructions"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Send Order via WhatsApp</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    Your order will be sent to our team via WhatsApp. We'll
                    confirm pricing and availability shortly.
                  </p>
                  <p className="font-medium text-foreground">
                    Choose a number to send your order:
                  </p>
                </div>

                <Button
                  onClick={() =>
                    handleWhatsAppOrder(CONTACT_CONFIG.whatsappNumber1)
                  }
                  disabled={submitOrder.isPending}
                  className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white"
                  size="lg"
                >
                  {submitOrder.isPending ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <MessageCircle className="mr-2 h-5 w-5" />
                  )}
                  Send to {CONTACT_CONFIG.phone}
                </Button>

                <Button
                  onClick={() =>
                    handleWhatsAppOrder(CONTACT_CONFIG.whatsappNumber2)
                  }
                  disabled={submitOrder.isPending}
                  className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white"
                  size="lg"
                >
                  {submitOrder.isPending ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <MessageCircle className="mr-2 h-5 w-5" />
                  )}
                  Send to {CONTACT_CONFIG.phone2}
                </Button>

                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground">
                    * Required fields must be filled before sending
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
