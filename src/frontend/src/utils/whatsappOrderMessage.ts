import type { Product } from "../backend";
import type { LocalCartItem } from "../hooks/useCart";

export interface CustomerDetails {
  fullName: string;
  phone: string;
  email: string;
  deliveryAddress: string;
  companyName?: string;
  remarks?: string;
}

export function formatWhatsAppOrderMessage(
  customerDetails: CustomerDetails,
  cartItems: LocalCartItem[],
  products: Product[],
): string {
  const productMap = new Map(products.map((p) => [p.id, p]));

  let message = "🔧 NEW INDUSTRIAL ORDER REQUEST\n\n";
  message += "📋 Customer Details:\n";
  message += `Name: ${customerDetails.fullName}\n`;
  if (customerDetails.companyName) {
    message += `Company: ${customerDetails.companyName}\n`;
  }
  message += `Phone: ${customerDetails.phone}\n`;
  message += `Email: ${customerDetails.email}\n\n`;

  message += `📍 Delivery Address:\n${customerDetails.deliveryAddress}\n\n`;

  message += "🛒 Products Ordered:\n";
  cartItems.forEach((item, index) => {
    const product = productMap.get(item.productId);
    if (product) {
      message += `${index + 1}. ${product.name} - ${item.quantity} ${item.quantity === 1 ? "unit" : "units"}`;
      if (item.customNotes) {
        message += ` (${item.customNotes})`;
      }
      message += "\n";
    }
  });

  if (customerDetails.remarks) {
    message += `\n💬 Remarks:\n${customerDetails.remarks}\n`;
  }

  message += "\n✅ Please confirm price and availability.";

  return message;
}

export function generateWhatsAppUrl(
  phoneNumber: string,
  message: string,
): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}
