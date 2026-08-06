'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Truck, Sparkles, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { triggerConfetti } from '@/lib/utils';

export function MagicIncentivesBanner() {
  const { totals } = useCart();

  return (
    <section id="beneficios" className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Shipping Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left border-2 border-pink-300"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl flex-shrink-0">
              🚚
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-pink-200 block">
                ENVÍOS SEGUROS A TODA COLOMBIA
              </span>
              <h3 className="font-black text-lg sm:text-xl">
                Envíos rápidos a cualquier ciudad o municipio desde Manizales 🇨🇴✨
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-md text-xs font-extrabold border border-white/30 whitespace-nowrap">
            <span>Manizales & Cobertura Nacional</span>
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" />
          </div>
        </motion.div>

        {/* Sorpresa Mágica Card (No "Ñapa") */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card p-8 sm:p-12 rounded-[3rem] bg-gradient-to-br from-pink-100 via-purple-50 to-pink-100 border-4 border-pink-300 shadow-2xl relative overflow-hidden"
        >
          {/* Background sparkles */}
          <div className="absolute top-4 right-6 text-4xl opacity-40 animate-pulse">🎁</div>
          <div className="absolute bottom-4 left-6 text-4xl opacity-40 animate-bounce">✨</div>

          <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-pink-700 font-extrabold text-xs border border-pink-200 shadow-md">
              <Gift className="w-4 h-4 text-pink-500 animate-bounce" />
              <span>Sorpresa Mágica Totalmente GRATIS</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-pink-950 leading-tight">
              Lleva 2 Scoops o más y la cuchara se emociona agregando una{' '}
              <span className="kawaii-gradient-text">
                Sorpresa Mágica totalmente GRATIS 💖
              </span>
            </h2>

            <p className="text-base sm:text-lg text-pink-900/80 font-semibold max-w-2xl mx-auto">
              Premia tu curiosidad: al sumar 2 o más cucharadas a tu carrito, el sistema desbloqueará de forma automática un regalo sorpresa exclusivo sin costo adicional.
            </p>

            {/* Dynamic Unlocked Status Banner */}
            <div className="pt-4 flex justify-center">
              {totals.magicSurpriseUnlocked ? (
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="bg-emerald-500 text-white font-extrabold px-6 py-3 rounded-full text-sm shadow-lg flex items-center gap-2 border-2 border-white"
                >
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                  <span>¡SORPRESA MÁGICA DESBLOQUEADA EN TU CARRITO! 🎉</span>
                </motion.div>
              ) : (
                <div className="bg-white/90 text-pink-900 font-bold px-6 py-3 rounded-full text-xs sm:text-sm border border-pink-200 shadow-sm flex items-center gap-2">
                  <span>Agrega {Math.max(1, 2 - totals.totalScoopsCount)} Scoop más para desbloquear tu regalo</span>
                  <Gift className="w-4 h-4 text-pink-500" />
                </div>
              )}
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
