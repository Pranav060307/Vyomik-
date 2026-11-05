import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem } from '../types/store';

export interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotalPaise: number;
  shippingFeePaise: number;
  totalPaise: number;
  freeShippingThresholdPaise: number;
}

const FREE_SHIPPING_THRESHOLD_PAISE = 149900; // Rs. 1,499
const DEFAULT_SHIPPING_FEE_PAISE = 9900; // Rs. 99
const STORAGE_KEY = 'vyomik_shopping_bag_v1';

const defaultCartContext: CartContextType = {
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  itemCount: 0,
  subtotalPaise: 0,
  shippingFeePaise: 0,
  totalPaise: 0,
  freeShippingThresholdPaise: FREE_SHIPPING_THRESHOLD_PAISE,
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore localStorage write error if disabled in sandbox/private mode
    }
  }, [items]);

  const addItem = (newItem: CartItem) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === newItem.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += newItem.quantity;
        return updated;
      }
      return [...prev, newItem];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalPaise = items.reduce((sum, item) => sum + item.pricePaise * item.quantity, 0);
  const shippingFeePaise =
    subtotalPaise === 0 || subtotalPaise >= FREE_SHIPPING_THRESHOLD_PAISE
      ? 0
      : DEFAULT_SHIPPING_FEE_PAISE;
  const totalPaise = subtotalPaise + shippingFeePaise;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotalPaise,
        shippingFeePaise,
        totalPaise,
        freeShippingThresholdPaise: FREE_SHIPPING_THRESHOLD_PAISE,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    return defaultCartContext;
  }
  return context;
};
