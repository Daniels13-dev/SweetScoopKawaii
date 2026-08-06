'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check, Star, Gift, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { SCOOP_PRODUCTS } from '@/lib/constants';

export function SizeComparisonSection() {
  const { addItem, setSizeModalWorld } = useCart();

  const handleSelectSize = (productId: string) => {
    const prod = SCOOP_PRODUCTS.find(p => p.id === productId);
    if (prod) {
      addItem(prod, 1);
    }
  };

  return (
    <section id="comparacion" className="py-20 relative bg-gradient-to-b from-pink-50/40 via-purple-50/30 to-pink-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 text-pink-700 text-xs font-extrabold border border-pink-200 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>Guía Rápida de Tamaños • CRO Claridad Instantánea</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-pink-950">
            ¿Cuál tamaño es perfecto para ti? 🥄✨
          </h2>
          <p className="text-pink-900/80 font-semibold text-base sm:text-lg">
            Entiende en <span className="underline decoration-pink-400 decoration-wavy">menos de 3 segundos</span> la diferencia de cantidad y valor percibido entre ambas cucharadas.
          </p>
        </div>

        {/* Deposit Policy Notice Banner */}
        <div className="mt-6 max-w-2xl mx-auto bg-amber-100/90 p-3 rounded-2xl border border-amber-300 text-center text-xs font-bold text-amber-950 shadow-sm flex items-center justify-center gap-2">
          <span>📌</span>
          <span>
            <strong>Reserva tu turno con solo $20.000:</strong> El valor restante se cancela después de ver tu video. 
            <span className="block text-[11px] text-amber-800 font-medium">(El abono no es reembolsable, pero sí 100% redimible en el valor total de tu scoop)</span>
          </span>
        </div>

        {/* Visual Side-by-Side Comparison Container */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
          
          {/* 1. CUCHARITA CARD ($35.000) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card p-8 rounded-[2.5rem] bg-white/90 border-2 border-pink-200 flex flex-col justify-between relative shadow-lg hover:shadow-xl transition-all"
          >
            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="px-3.5 py-1 rounded-full bg-pink-100 text-pink-700 font-extrabold text-xs border border-pink-200">
                  Ideal para Comenzar
                </span>
                <span className="text-3xl">🥄</span>
              </div>

              <h3 className="text-3xl font-black text-pink-950">
                Cucharita
              </h3>
              <p className="text-xs text-pink-700 font-bold mt-1">
                Caja Pequeña Sorpresa
              </p>

              {/* Price Tag */}
              <div className="my-6">
                <span className="text-4xl font-black text-pink-900">$35.000</span>
                <span className="text-xs text-pink-600 font-bold ml-2">COP</span>
              </div>

              {/* Visual Box Density Indicator */}
              <div className="bg-pink-50 p-4 rounded-2xl border border-pink-200 space-y-2 mb-6">
                <div className="flex items-center justify-between text-xs font-extrabold text-pink-900">
                  <span>Visualización de Contenido:</span>
                  <span className="text-pink-600 font-black">5 Artículos</span>
                </div>
                <div className="text-2xl tracking-widest flex items-center justify-center bg-white py-2 rounded-xl border border-pink-200 shadow-inner">
                  🛍️🛍️🛍️🛍️🛍️
                </div>
              </div>

              {/* Feature Checklist */}
              <ul className="space-y-3 text-sm font-semibold text-pink-900/90 mb-8">
                <li className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-pink-200 text-pink-800 flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                  <span><strong>Más de 5 artículos</strong> sorpresa</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-pink-200 text-pink-800 flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                  <span>Variedad esencial seleccionada</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-pink-200 text-pink-800 flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                  <span>Ideal para regalos o primer scoop</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectSize('kawaii-cucharita')}
              className="w-full py-3.5 rounded-full kawaii-secondary-btn font-extrabold text-sm flex items-center justify-center gap-2"
            >
              <span>Elegir Cucharita ($35.000)</span>
            </button>
          </motion.div>

          {/* 2. GRAN CUCHARADA CARD ($50.000) - GIANT VALUE HERO */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card p-8 rounded-[2.5rem] bg-gradient-to-b from-purple-50 via-pink-50 to-purple-100 border-4 border-pink-400 flex flex-col justify-between relative shadow-2xl scale-102 sm:scale-105 z-10"
          >
            {/* Top Popular Highlight Floating Ribbon */}
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full kawaii-gradient-btn text-white text-xs font-black tracking-wide shadow-xl flex items-center gap-1.5 whitespace-nowrap">
              <Star className="w-4 h-4 fill-amber-300 text-amber-300 animate-spin" />
              <span>✨ MÁS POPULAR • MAYOR VALOR PERCIBIDO 🔥</span>
            </div>

            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-4 pt-2">
                <span className="px-3.5 py-1 rounded-full bg-purple-200 text-purple-900 font-black text-xs border border-purple-300">
                  ¡EL DOBLE DE MAGIA! 🎁
                </span>
                <span className="text-4xl animate-bounce">🥄✨</span>
              </div>

              <h3 className="text-3xl sm:text-4xl font-black text-purple-950">
                Gran Cucharada
              </h3>
              <p className="text-xs text-purple-700 font-bold mt-1">
                Caja Grande • Máxima Experiencia Premium
              </p>

              {/* Price Tag */}
              <div className="my-6 flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black text-pink-600">$50.000</span>
                <span className="text-xs text-pink-700 font-extrabold">COP</span>
                <span className="text-xs font-black text-purple-700 bg-white/80 px-2.5 py-1 rounded-full border border-purple-200 ml-auto">
                  ¡Mejor Relación Cantidad/Precio!
                </span>
              </div>

              {/* Visual Box Density Indicator (10 items - DOUBLE THE SIZE) */}
              <div className="bg-purple-100/90 p-4 rounded-2xl border-2 border-purple-300 space-y-2 mb-6 shadow-md">
                <div className="flex items-center justify-between text-xs font-black text-purple-950">
                  <span>Visualización de Contenido:</span>
                  <span className="text-purple-700 font-black text-sm">✨ 10+ Artículos</span>
                </div>
                <div className="text-xl sm:text-2xl tracking-widest flex items-center justify-center bg-white py-2.5 rounded-xl border border-purple-200 shadow-inner font-extrabold">
                  🛍️🛍️🛍️🛍️🛍️🛍️🛍️🛍️🛍️🛍️
                </div>
              </div>

              {/* Feature Checklist */}
              <ul className="space-y-3 text-sm font-bold text-purple-950 mb-8">
                <li className="flex items-center gap-2.5 bg-white/70 p-2 rounded-xl border border-purple-200">
                  <div className="w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center text-xs font-black">
                    ✨
                  </div>
                  <span><strong>Más de 10 artículos sorpresa</strong> (El doble que la Cucharita)</span>
                </li>
                <li className="flex items-center gap-2.5 bg-white/70 p-2 rounded-xl border border-purple-200">
                  <div className="w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center text-xs font-black">
                    ✨
                  </div>
                  <span><strong>Más variedad</strong> de categorías y coleccionables</span>
                </li>
                <li className="flex items-center gap-2.5 bg-white/70 p-2 rounded-xl border border-purple-200">
                  <div className="w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center text-xs font-black">
                    ✨
                  </div>
                  <span><strong>Mayor posibilidad de productos premium</strong> de edición limitada</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectSize('kawaii-cucharada')}
              className="w-full py-4 rounded-full kawaii-gradient-btn text-white font-black text-base flex items-center justify-center gap-2 shadow-xl hover:scale-102 transition-transform"
            >
              <span>Elegir Gran Cucharada ($50.000) ✨</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>

        </div>

        {/* Candy Scoop Special Notice */}
        <div className="mt-14 max-w-2xl mx-auto glass-panel p-6 rounded-3xl text-center border border-amber-200 bg-amber-50/60">
          <div className="flex items-center justify-center gap-2 text-amber-900 font-extrabold text-sm mb-1">
            <span className="text-2xl">🍬</span>
            <span>¿Buscas la Opción de Dulcería Nacional?</span>
          </div>
          <p className="text-xs text-amber-950 font-medium">
            Pequeñas Aventuras Dulces cuenta con una opción de <strong>Cucharada Única por $30.000</strong> que incluye un mínimo de <strong>25 dulces nacionales</strong>.
          </p>
        </div>

      </div>
    </section>
  );
}
