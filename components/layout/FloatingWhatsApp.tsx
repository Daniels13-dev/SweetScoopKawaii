'use client';

import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { buildWhatsAppQuickCartLink, formatCurrency } from '@/lib/utils';

export function FloatingWhatsApp() {
  const { items, totals, coupon } = useCart();

  const whatsappUrl = buildWhatsAppQuickCartLink(items, totals, coupon);
  const hasItems = items.length > 0;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      {/* Tooltip label */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 text-xs font-extrabold text-pink-900 shadow-lg border border-pink-200"
      >
        {hasItems ? (
          <span>¡Pedir {totals.totalScoopsCount} Scoop(s) ({formatCurrency(totals.finalTotal)}) por WhatsApp!</span>
        ) : (
          <span>¡Chat Kawaii 3104494494!</span>
        )}
        <span className="text-pink-500">✨</span>
      </motion.div>

      {/* Button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 text-white shadow-xl hover:bg-emerald-600 transition-colors border-2 border-white group"
        aria-label="Contactar por WhatsApp"
      >
        <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-30" />
        <FaWhatsapp className="w-8 h-8 group-hover:rotate-12 transition-transform" />
        {hasItems && (
          <span className="absolute -top-1 -right-1 bg-yellow-400 text-pink-950 text-xs font-black w-5 h-5 rounded-full flex items-center justify-center shadow border border-white">
            {totals.totalScoopsCount}
          </span>
        )}
      </motion.a>
    </div>
  );
}

