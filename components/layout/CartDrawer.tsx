'use client';

import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, Sparkles, Gift, Truck, ArrowRight, Ticket } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    coupon,
    applyCoupon,
    removeCoupon,
    totals,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ success: boolean; message: string } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    
    // Set loading message
    setCouponMsg({ success: false, message: 'Validando cupón...' });
    
    const res = await applyCoupon(couponInput);
    setCouponMsg(res);
    if (res.success) {
      setCouponInput('');
    }
  };

  // Calculating scoop progress bars
  const scoopsForMagic = Math.max(0, 2 - totals.totalScoopsCount);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
          className="absolute inset-0 bg-pink-950/40 backdrop-blur-sm"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-pink-200"
          >
            {/* Drawer Header */}
            <div className="p-6 bg-gradient-to-r from-pink-50 via-purple-50 to-pink-100 border-b border-pink-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-pink-500 text-white flex items-center justify-center shadow-md">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-pink-950 flex items-center gap-1.5">
                    <span>Tu Cucharada Mágica</span>
                    <Sparkles className="w-4 h-4 text-pink-500" />
                  </h3>
                  <p className="text-xs font-semibold text-pink-700">
                    {totals.totalScoopsCount} {totals.totalScoopsCount === 1 ? 'Scoop' : 'Scoops'} seleccionados
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-full text-pink-500 hover:bg-pink-200/50 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Incentive Progress Meter Banner */}
            <div className="bg-gradient-to-r from-amber-50 to-pink-50 p-4 border-b border-pink-200/60 space-y-2.5">
              {/* Magic Surprise Incentive */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-pink-950">
                  <span className="flex items-center gap-1">
                    <Gift className="w-3.5 h-3.5 text-pink-500" />
                    Sorpresa Mágica GRATIS
                  </span>
                  <span className="text-pink-600">
                    {totals.magicSurpriseUnlocked ? '¡DESBLOQUEADO! 🎁' : `Falta ${scoopsForMagic} Scoop`}
                  </span>
                </div>
                <div className="w-full bg-white h-2.5 rounded-full overflow-hidden border border-pink-200 shadow-inner">
                  <div
                    className="bg-gradient-to-r from-pink-400 to-pink-600 h-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (totals.totalScoopsCount / 2) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Cart Items Scroll Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                  <div className="text-6xl animate-bounce">🥄</div>
                  <h4 className="font-extrabold text-pink-900 text-lg">Tu cucharada está vacía</h4>
                  <p className="text-sm text-pink-700/80 max-w-xs mx-auto">
                    Elige entre Mundo Kawaii, Beauty Glow o Dulcería y comienza a llenar tu carrito de emoción.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 px-6 py-2.5 rounded-full kawaii-gradient-btn text-white text-xs font-extrabold shadow-md"
                  >
                    Ver Cucharadas ✨
                  </button>
                </div>
              ) : (
                items.map(item => (
                  <div
                    key={item.cartId}
                    className="glass-card p-4 rounded-3xl flex items-center justify-between gap-3 relative border border-pink-200"
                  >
                    {/* Item Info */}
                    <div className="flex items-center gap-3">
                      <div className="text-3xl p-2.5 rounded-2xl bg-pink-100/80 border border-pink-200">
                        {item.product.worldEmoji}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-pink-950 text-sm">
                          {item.product.worldTitle}
                        </h4>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          <span className="text-xs font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-200">
                            {item.product.sizeName}
                          </span>
                          <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                            {item.product.itemsCountText}
                          </span>
                        </div>
                        <p className="text-sm font-extrabold text-pink-900 mt-1">
                          {formatCurrency(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => removeItem(item.cartId)}
                        className="text-pink-400 hover:text-pink-600 p-1"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="flex items-center gap-2 bg-pink-100/60 p-1 rounded-full border border-pink-200">
                        <button
                          onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                          className="w-6 h-6 rounded-full bg-white text-pink-700 flex items-center justify-center font-bold text-xs shadow-sm hover:bg-pink-50"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-extrabold text-xs text-pink-950 w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                          className="w-6 h-6 rounded-full bg-white text-pink-700 flex items-center justify-center font-bold text-xs shadow-sm hover:bg-pink-50"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Summary / Checkout Trigger */}
            {items.length > 0 && (
              <div className="p-6 bg-white border-t border-pink-200 space-y-4 shadow-lg">
                
                {/* Coupon Code Section */}
                <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Ticket className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-pink-400" />
                      <input
                        type="text"
                        value={couponInput}
                        onChange={e => setCouponInput(e.target.value)}
                        placeholder="Código de cupón (ej: MAGIC10)"
                        className="w-full pl-9 pr-3 py-2 text-xs font-bold rounded-xl border border-pink-200 bg-pink-50/50 focus:outline-none focus:border-pink-500 uppercase placeholder:normal-case placeholder:font-normal"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3.5 py-2 rounded-xl bg-pink-600 text-white font-bold text-xs hover:bg-pink-700 transition-colors"
                    >
                      Aplicar
                    </button>
                  </div>

                  {couponMsg && (
                    <p className={`text-xs font-bold ${couponMsg.success ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {couponMsg.message}
                    </p>
                  )}

                  {coupon && (
                    <div className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-800 p-2 rounded-xl border border-emerald-200 font-bold">
                      <span>🎟️ Cupón Activo: {coupon.code} (-{coupon.discountPercent}%)</span>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-emerald-600 hover:text-emerald-900 underline text-[10px]"
                      >
                        Quitar
                      </button>
                    </div>
                  )}
                </form>

                {/* Subtotal & Totals */}
                <div className="space-y-1.5 text-xs border-t border-pink-100 pt-3">
                  <div className="flex justify-between text-pink-900/80 font-semibold">
                    <span>Subtotal</span>
                    <span>{formatCurrency(totals.subtotal)}</span>
                  </div>

                  {totals.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Descuento Cupón</span>
                      <span>-{formatCurrency(totals.discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-pink-950 font-extrabold text-base pt-1">
                    <span>Total a Pagar</span>
                    <span className="kawaii-gradient-text text-lg">
                      {formatCurrency(totals.finalTotal)}
                    </span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full py-3.5 rounded-full kawaii-gradient-btn text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>Quiero mi Scoop Kawaii 💖</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
