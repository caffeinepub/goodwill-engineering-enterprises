import { useEffect, useState } from "react";

export interface LocalCartItem {
  productId: bigint;
  quantity: number;
  customNotes?: string;
}

const CART_STORAGE_KEY = "goodwill_cart";

export function useCart() {
  const [cart, setCart] = useState<LocalCartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert string IDs back to bigint
        return parsed.map((item: any) => ({
          ...item,
          productId: BigInt(item.productId),
        }));
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
    }
    return [];
  });

  useEffect(() => {
    try {
      // Convert bigint to string for storage
      const serializable = cart.map((item) => ({
        ...item,
        productId: item.productId.toString(),
      }));
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(serializable));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [cart]);

  const addToCart = (
    productId: bigint,
    quantity: number,
    customNotes?: string,
  ) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === productId,
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          productId,
          quantity: updated[existingIndex].quantity + quantity,
          customNotes: customNotes || updated[existingIndex].customNotes,
        };
        return updated;
      }
      return [...prev, { productId, quantity, customNotes }];
    });
  };

  const updateQuantity = (productId: bigint, quantity: number) => {
    setCart((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.productId !== productId);
      }
      const existingIndex = prev.findIndex(
        (item) => item.productId === productId,
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], quantity };
        return updated;
      }
      return prev;
    });
  };

  const updateNotes = (productId: bigint, customNotes: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === productId,
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], customNotes };
        return updated;
      }
      return prev;
    });
  };

  const removeFromCart = (productId: bigint) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getItemCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  return {
    cart,
    addToCart,
    updateQuantity,
    updateNotes,
    removeFromCart,
    clearCart,
    getItemCount,
  };
}
