import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem } from '../types/store';

export interface CartContextType {
  items: CartItem[];
  addItem: (item: Partial<CartItem> & { id: string }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotalRupees: number;
  subtotalPaise: number;
  shippingFeePaise: number;
  totalPaise: number;
  freeShippingThresholdPaise: number;
  isBagOpen: boolean;
  openBag: () => void;
  closeBag: () => void;
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
}

const FREE_SHIPPING_THRESHOLD_PAISE = 149900; // Rs. 1,499
const DEFAULT_SHIPPING_FEE_PAISE = 9900; // Rs. 99
const STORAGE_KEY = 'vyomik_cart';

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('vyomik_shopping_bag_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((item: any) => ({
          ...item,
          name: item.name || item.title || item.id,
          title: item.title || item.name || item.id,
          price: item.price ?? (item.pricePaise ? item.pricePaise / 100 : 0),
          pricePaise: item.pricePaise ?? (item.price ? item.price * 100 : 0),
          quantity: item.quantity || item.qty || 1,
        }));
      }
      return [];
    } catch {
      return [];
    }
  });

  const [isBagOpen, setIsBagOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore
    }
  }, [items]);

  const addItem = (item: Partial<CartItem> & { id: string }) => {
    const price = item.price ?? (item.pricePaise ? item.pricePaise / 100 : 899);
    const pricePaise = item.pricePaise ?? price * 100;
    const name = item.name || item.title || item.id;
    const title = item.title || item.name || item.id;
    const quantity = item.quantity || 1;

    const fullItem: CartItem = {
      id: item.id,
      name,
      title,
      price,
      pricePaise,
      quantity,
      type: item.type || 'tee',
      color: item.color || '#d9c3ad',
      logo: item.logo || '0',
      img: item.img || item.image || '',
      image: item.image || item.img || '',
      size: item.size || 'M',
      productId: item.productId,
      variantId: item.variantId,
    };

    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === fullItem.id);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx].quantity += quantity;
        return copy;
      }
      return [...prev, fullItem];
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
  const subtotalPaise = items.reduce((sum, item) => sum + (item.pricePaise || 0) * item.quantity, 0);
  const subtotalRupees = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  const shippingFeePaise =
    subtotalPaise === 0 || subtotalPaise >= FREE_SHIPPING_THRESHOLD_PAISE || subtotalPaise <= 100
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
        subtotalRupees,
        subtotalPaise,
        shippingFeePaise,
        totalPaise,
        freeShippingThresholdPaise: FREE_SHIPPING_THRESHOLD_PAISE,
        isBagOpen,
        openBag: () => setIsBagOpen(true),
        closeBag: () => setIsBagOpen(false),
        isSearchOpen,
        openSearch: () => setIsSearchOpen(true),
        closeSearch: () => setIsSearchOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

const defaultCartContext: CartContextType = {
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  itemCount: 0,
  subtotalRupees: 0,
  subtotalPaise: 0,
  shippingFeePaise: 0,
  totalPaise: 0,
  freeShippingThresholdPaise: FREE_SHIPPING_THRESHOLD_PAISE,
  isBagOpen: false,
  openBag: () => {},
  closeBag: () => {},
  isSearchOpen: false,
  openSearch: () => {},
  closeSearch: () => {},
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    return defaultCartContext;
  }
  return context;
};
