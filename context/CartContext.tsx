'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ScoopProduct, CartItem, AppliedCoupon, WorldId } from '@/lib/types';
import { calculateCartTotals, triggerConfetti } from '@/lib/utils';
import { SCOOP_PRODUCTS } from '@/lib/constants';

interface CartContextType {
  items: CartItem[];
  addItem: (product: ScoopProduct, quantity?: number) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  coupon: AppliedCoupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  totals: ReturnType<typeof calculateCartTotals>;
  
  // Modals & Drawers state
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  sizeModalWorld: WorldId | null;
  setSizeModalWorld: (world: WorldId | null) => void;
  isGame1Open: boolean; // Atrapa la ternura
  setIsGame1Open: (open: boolean) => void;
  isGame2Open: boolean; // Ruleta del destino
  setIsGame2Open: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [sizeModalWorld, setSizeModalWorld] = useState<WorldId | null>(null);
  const [isGame1Open, setIsGame1Open] = useState(false);
  const [isGame2Open, setIsGame2Open] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('kawaii_cart');
      const savedCoupon = localStorage.getItem('kawaii_coupon');
      if (savedCart) setItems(JSON.parse(savedCart));
      if (savedCoupon) setCoupon(JSON.parse(savedCoupon));
    } catch (e) {
      console.error('Failed to load cart from storage:', e);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kawaii_cart', JSON.stringify(items));
      if (coupon) {
        localStorage.setItem('kawaii_coupon', JSON.stringify(coupon));
      } else {
        localStorage.removeItem('kawaii_coupon');
      }
    } catch (e) {
      console.error('Failed to save cart:', e);
    }
  }, [items, coupon]);

  const totals = calculateCartTotals(items, coupon);

  const addItem = (product: ScoopProduct, quantity: number = 1) => {
    const existingIndex = items.findIndex(
      item => item.product.id === product.id
    );

    let newItems = [...items];
    if (existingIndex > -1) {
      newItems[existingIndex].quantity += quantity;
    } else {
      newItems.push({
        cartId: `${product.id}-${Date.now()}`,
        product,
        quantity
      });
    }

    setItems(newItems);
    triggerConfetti();
    setIsCartOpen(true);
  };

  const removeItem = (cartId: string) => {
    setItems(items.filter(item => item.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(cartId);
      return;
    }
    setItems(
      items.map(item =>
        item.cartId === cartId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, message: 'Ingresa un código de cupón' };
    }

    const valid10PercentCodes = ['MAGIC10', 'DESTINO10', 'KAWAII10', 'KAWAII', 'SCOOP10', 'MAGIC15', 'SUPERMAGIA', 'KAWAII5', 'STICKERBONUS'];

    if (valid10PercentCodes.includes(cleanCode)) {
      const newCoupon = { code: cleanCode, discountPercent: 10 };
      setCoupon(newCoupon);
      triggerConfetti();
      return { success: true, message: '¡Cupón de 10% OFF aplicado con éxito! ✨' };
    }

    return { success: false, message: 'Cupón no válido o expirado' };
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        coupon,
        applyCoupon,
        removeCoupon,
        totals,
        isCartOpen,
        setIsCartOpen,
        sizeModalWorld,
        setSizeModalWorld,
        isGame1Open,
        setIsGame1Open,
        isGame2Open,
        setIsGame2Open,
        isCheckoutOpen,
        setIsCheckoutOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
