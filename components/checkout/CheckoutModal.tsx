'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Send, CheckCircle2, ShieldCheck, Heart, Truck, Gift, MapPin, UserCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency, buildWhatsAppOrderLink } from '@/lib/utils';
import { saveOrderToSupabase } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

export function CheckoutModal() {
  const {
    items,
    totals,
    coupon,
    clearCart,
    isCheckoutOpen,
    setIsCheckoutOpen
  } = useCart();

  const { user, addresses } = useAuth();

  const [formData, setFormData] = useState({
    customerName: '',
    whatsapp: '',
    city: 'Manizales',
    address: '',
    notes: '',
    paymentMethod: 'nequi'
  });

  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Autocomplete form from user profile & addresses
  useEffect(() => {
    if (!isCheckoutOpen) return;

    if (user) {
      const defaultAddr = addresses.find(a => a.is_default) || addresses[0];
      setFormData(prev => ({
        ...prev,
        customerName: user.full_name || prev.customerName,
        whatsapp: user.whatsapp || prev.whatsapp,
        city: defaultAddr?.city || user.city || prev.city,
        address: defaultAddr?.address_line || prev.address
      }));

      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
      }
    }
  }, [isCheckoutOpen, user, addresses]);

  if (!isCheckoutOpen) return null;

  const handleSelectAddress = (addrId: string) => {
    setSelectedAddressId(addrId);
    const target = addresses.find(a => a.id === addrId);
    if (target) {
      setFormData(prev => ({
        ...prev,
        customerName: target.recipient_name || user?.full_name || prev.customerName,
        whatsapp: target.recipient_phone || user?.whatsapp || prev.whatsapp,
        city: target.city || prev.city,
        address: target.address_line
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName.trim() || !formData.whatsapp.trim() || !formData.address.trim()) {
      setErrorMessage('Por favor completa todos los campos requeridos (Nombre, WhatsApp y Dirección)');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const orderPayload = {
      userId: user?.id,
      ...formData,
      cartItems: items,
      subtotal: totals.subtotal,
      discountAmount: totals.discountAmount,
      totalAmount: totals.finalTotal,
      magicSurpriseUnlocked: totals.magicSurpriseUnlocked,
      couponCode: coupon ? coupon.code : null
    };

    // Save to Supabase
    await saveOrderToSupabase(orderPayload);

    // Build WhatsApp direct URL
    const whatsappUrl = buildWhatsAppOrderLink(formData, items, totals, coupon);

    // Clear cart and close modal
    clearCart();
    setIsSubmitting(false);
    setIsCheckoutOpen(false);

    // Redirect to WhatsApp
    window.open(whatsappUrl, '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCheckoutOpen(false)}
          className="fixed inset-0 bg-pink-950/60 backdrop-blur-md"
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-xl bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border-4 border-pink-300 z-10 space-y-6"
        >
          {/* Close Button */}
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full text-pink-400 hover:text-pink-600 hover:bg-pink-100/50"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Modal Header */}
          <div className="text-center space-y-1">
            <div className="text-3xl">🎀</div>
            <h3 className="text-2xl sm:text-3xl font-black text-pink-950">
              Finalizar mi Pedido Mágico
            </h3>
            <p className="text-xs sm:text-sm text-pink-700 font-bold">
              Completa tus datos para enviarte tu confirmación directamente a WhatsApp.
            </p>
          </div>

          {/* Summary Box */}
          <div className="bg-pink-50/80 p-4 rounded-2xl border border-pink-200 space-y-2.5 text-xs">
            <div className="flex justify-between font-extrabold text-pink-950">
              <span>{totals.totalScoopsCount} Scoop(s) seleccionados</span>
              <span className="text-pink-600 font-black">{formatCurrency(totals.finalTotal)}</span>
            </div>

            {/* Deposit terms highlight inside checkout */}
            <div className="bg-amber-100/90 p-3 rounded-xl border border-amber-300 space-y-1 font-bold text-amber-950">
              <div className="flex justify-between text-xs">
                <span>📌 Abono para separar turno:</span>
                <span className="font-extrabold text-amber-900">$20.000 COP</span>
              </div>
              <div className="flex justify-between text-xs text-amber-900 font-extrabold pt-0.5 border-t border-amber-200">
                <span>🎬 Saldo restante (tras ver tu video):</span>
                <span>{formatCurrency(Math.max(0, totals.finalTotal - 20000))}</span>
              </div>
              <p className="text-[10px] text-amber-800 font-semibold pt-1">
                * El abono de $20.000 no es reembolsable, pero es 100% redimible en el pago total de tu pedido.
              </p>
            </div>
            
            {totals.magicSurpriseUnlocked && (
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                <Gift className="w-3.5 h-3.5 text-emerald-600" />
                <span>Sorpresa Mágica Incluida GRATIS 🎁</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-pink-700 font-medium">
              <Truck className="w-3.5 h-3.5 text-pink-500" />
              <span>Envíos seguros desde Manizales a todo el país 🇨🇴</span>
            </div>
          </div>

          {/* Checkout Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Logged in User Quick Address Selector */}
            {user && addresses.length > 0 && (
              <div className="bg-purple-50/90 p-3 rounded-2xl border border-purple-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-black text-purple-950">
                  <span className="flex items-center gap-1">
                    <UserCheck className="w-4 h-4 text-purple-600" />
                    <span>Usar Dirección Guardada ({user.full_name.split(' ')[0]})</span>
                  </span>
                  <span className="text-[10px] text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full font-bold">
                    Autocompletado ✨
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {addresses.map(addr => (
                    <button
                      key={addr.id}
                      type="button"
                      onClick={() => handleSelectAddress(addr.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
                        selectedAddressId === addr.id
                          ? 'bg-purple-600 text-white border-purple-700 shadow-sm'
                          : 'bg-white text-purple-900 border-purple-200 hover:bg-purple-100'
                      }`}
                    >
                      <MapPin className="w-3 h-3" />
                      <span>{addr.label}: {addr.address_line.substring(0, 20)}...</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {errorMessage && (
              <div className="bg-rose-50 text-rose-600 text-xs font-bold p-3 rounded-xl border border-rose-200">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-pink-950 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Tu nombre tierno"
                  value={formData.customerName}
                  onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-pink-200 focus:border-pink-500 focus:outline-none bg-pink-50/30"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-pink-950 mb-1">
                  WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ej: 3001234567"
                  value={formData.whatsapp}
                  onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-pink-200 focus:border-pink-500 focus:outline-none bg-pink-50/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-pink-950 mb-1">
                  Ciudad *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Manizales, Bogotá, Medellín..."
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-pink-200 focus:border-pink-500 focus:outline-none bg-pink-50/30"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-pink-950 mb-1">
                  Dirección de Entrega *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Carrera, Calle, Casa, Apto..."
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-pink-200 focus:border-pink-500 focus:outline-none bg-pink-50/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-pink-950 mb-1">
                Método de Pago Preferido
              </label>
              <select
                value={formData.paymentMethod}
                onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-pink-200 focus:border-pink-500 focus:outline-none bg-pink-50/30 text-pink-950"
              >
                <option value="nequi">Nequi (Transferencia Rápida)</option>
                <option value="daviplata">Daviplata</option>
                <option value="transferencia">Bancolombia / Transferencia PSE</option>
                <option value="contraentrega">Pago Contraentrega (Sujeto a cobertura)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-pink-950 mb-1">
                Notas adicionales (Opcional)
              </label>
              <textarea
                rows={2}
                placeholder="Ej: Si es un regalo, especificaciones o dedicatoria..."
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border border-pink-200 focus:border-pink-500 focus:outline-none bg-pink-50/30"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-full kawaii-gradient-btn text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl hover:scale-102 transition-transform disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>
                {isSubmitting ? 'Enviando a WhatsApp...' : 'Enviar Pedido Mágico a WhatsApp 💬'}
              </span>
            </button>

          </form>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
