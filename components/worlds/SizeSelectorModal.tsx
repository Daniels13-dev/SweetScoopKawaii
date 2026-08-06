'use client';

import React from 'react';
import { X, Sparkles, Star, Check, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { SCOOP_PRODUCTS } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function SizeSelectorModal() {
  const { sizeModalWorld, setSizeModalWorld, addItem } = useCart();

  if (!sizeModalWorld) return null;

  const worldProducts = SCOOP_PRODUCTS.filter(
    p => p.worldId === sizeModalWorld
  );

  const worldTitle = worldProducts[0]?.worldTitle || 'Mundo Kawaii';
  const worldEmoji = worldProducts[0]?.worldEmoji || '🎀';

  const handleSelectProduct = (product: typeof worldProducts[0]) => {
    addItem(product, 1);
    setSizeModalWorld(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSizeModalWorld(null)}
          className="fixed inset-0 bg-pink-950/50 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border-4 border-pink-300 z-10 space-y-6"
        >
          {/* Close Button */}
          <button
            onClick={() => setSizeModalWorld(null)}
            className="absolute top-6 right-6 p-2 rounded-full text-pink-400 hover:text-pink-600 hover:bg-pink-100/50 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Modal Header */}
          <div className="text-center space-y-2">
            <div className="text-4xl">{worldEmoji}</div>
            <h3 className="text-2xl sm:text-3xl font-black text-pink-950">
              Escoge tu Tamaño en {worldTitle}
            </h3>
            <p className="text-xs sm:text-sm text-pink-700 font-bold">
              Ambas opciones incluyen sorpresas 100% únicas y seleccionadas con amor.
            </p>
          </div>

          {/* Product Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch pt-2">
            {worldProducts.map(product => (
              <div
                key={product.id}
                className={`glass-card p-6 rounded-3xl flex flex-col justify-between relative border-2 ${
                  product.isPopular
                    ? 'border-pink-500 bg-gradient-to-b from-purple-50 to-pink-50 shadow-xl'
                    : 'border-pink-200 bg-white'
                }`}
              >
                {product.isPopular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-pink-500 text-white font-extrabold text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-300 text-yellow-300" />
                    Mayor Valor ✨
                  </span>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-pink-800 bg-pink-100 px-2.5 py-1 rounded-full border border-pink-200">
                      {product.sizeName}
                    </span>
                    <span className="text-lg font-black text-pink-950">
                      {formatCurrency(product.price)}
                    </span>
                  </div>

                  <p className="text-xs font-black text-pink-600">
                    {product.itemsCountText}
                  </p>

                  <p className="text-xs text-pink-900/80 leading-relaxed font-medium">
                    {product.description}
                  </p>

                  {/* Included preview */}
                  <ul className="space-y-1.5 pt-2 text-[11px] font-semibold text-pink-900">
                    {product.includes.slice(0, 4).map((inc, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="text-pink-500 font-bold">•</span>
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleSelectProduct(product)}
                  className={`mt-6 w-full py-3 rounded-full font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md ${
                    product.isPopular
                      ? 'kawaii-gradient-btn text-white'
                      : 'kawaii-secondary-btn'
                  }`}
                >
                  <span>Seleccionar {product.sizeName}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
