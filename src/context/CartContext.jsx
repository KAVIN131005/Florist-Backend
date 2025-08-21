import React, { useEffect, useMemo, useState } from "react";
import { CartContext } from "./CartContextDefinition";
import { useAuth } from "../hooks/useAuth";

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const userKey = user?.id || user?._id || user?.userId;
  const storageKey = useMemo(() => `cart:${userKey || "guest"}`, [userKey]);

  const [cart, setCart] = useState([]);

  // Load cart for current user on mount/when user changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setCart(saved ? JSON.parse(saved) : []);
    } catch {
      setCart([]);
    }
  }, [storageKey]);

  // Persist cart whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(cart));
    } catch {
      // ignore storage errors
    }
  }, [cart, storageKey]);

  const addToCart = (product, quantity = 1) => {
    const productId = product?.id || product?._id;
    if (!productId) return; // cannot add without an id
    setCart((prev) => {
      const existing = prev.find((item) => item.id === productId);
      if (existing) {
        return prev.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      // Normalize stored item to flatten product fields and keep a stable id
      return [
        ...prev,
        {
          id: productId,
          name: product.name,
          price: product.price ?? product.pricePer100g ?? 0,
          imageUrl: product.imageUrl,
          category: product.categoryName || product.category,
          floristName: product.floristName,
          quantity,
          // Keep original raw product for details pages if needed
          _raw: product,
        },
      ];
    });
  };

  const removeFromCart = (productId) =>
    setCart((prev) => prev.filter((item) => item.id !== productId));

  const updateQuantity = (productId, quantity) => {
    const qty = Number(quantity);
    if (!Number.isFinite(qty)) return;
    if (qty <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== productId));
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity: qty } : item))
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
