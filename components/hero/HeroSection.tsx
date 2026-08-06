'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Star, ArrowRight, ShieldCheck, Truck, Users } from 'lucide-react';
import { triggerConfetti } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

export function HeroSection() {
  const { setSizeModalWorld, setIsGame1Open } = useCart();

  const handleHeroCta = () => {
    triggerConfetti();
    const el = document.getElementById('mundos');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setSizeModalWorld('kawaii');
    }
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      
      {/* Floating Animated Background Decorations */}
      <div className="absolute top-10 left-10 text-4xl animate-float opacity-70 pointer-events-none">
        🎀
      </div>
      <div className="absolute top-24 right-12 text-5xl animate-float-reverse opacity-70 pointer-events-none">
        ✨
      </div>
      <div className="absolute bottom-16 left-1/4 text-4xl animate-sparkle opacity-60 pointer-events-none">
        ⭐
      </div>
      <div className="absolute bottom-24 right-1/4 text-5xl animate-pulse-gentle opacity-70 pointer-events-none">
        🌸
      </div>
      <div className="absolute top-1/2 left-6 text-3xl animate-float opacity-50 pointer-events-none">
        💖
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-pink-200/80 shadow-md text-xs sm:text-sm font-extrabold text-pink-700 mb-6 backdrop-blur-md"
        >
          <span className="text-base animate-bounce">💖</span>
          <span>¡La Experiencia Sorpresa Más Viral de Colombia!</span>
          <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-600 text-[11px]">Envíos a todo el país</span>
        </motion.div>

        {/* Main Emotional Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none max-w-5xl mx-auto text-pink-950"
        >
          Descubre la cucharada sorpresa{' '}
          <span className="kawaii-gradient-text block sm:inline">
            más tierna de Colombia 🎀✨
          </span>
        </motion.h1>

        {/* Emotional Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl md:text-2xl text-pink-900/80 max-w-3xl mx-auto font-medium leading-relaxed"
        >
          No vendemos solo productos: entregamos <strong className="text-pink-600 font-extrabold">emoción, ilusión y magia</strong> en cada cucharada llena de tesoros Kawaii seleccionados con amor tierno.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={handleHeroCta}
            className="w-full sm:w-auto px-9 py-4 rounded-full kawaii-gradient-btn text-white font-black text-lg flex items-center justify-center gap-3 shadow-2xl group"
          >
            <span>Quiero mi Scoop 🥄✨</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => setIsGame1Open(true)}
            className="w-full sm:w-auto px-7 py-4 rounded-full kawaii-secondary-btn font-extrabold text-base flex items-center justify-center gap-2"
          >
            <span>¡Jugar y Ganar Descuento! 🎮</span>
          </button>
        </motion.div>

        {/* Turn Reservation Highlight Pill */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-8 max-w-xl mx-auto bg-amber-100/90 border-2 border-amber-300 p-3.5 rounded-2xl shadow-md text-xs sm:text-sm font-bold text-amber-950 flex flex-col sm:flex-row items-center justify-center gap-2"
        >
          <span className="text-base">📌</span>
          <span>
            <strong>¡Separa tu turno con solo $20.000!</strong> El restante se paga tras ver tu video. 
            <span className="block sm:inline text-[11px] text-amber-800 font-semibold ml-1">
              (Abono no reembolsable, 100% redimible en tu scoop)
            </span>
          </span>
        </motion.div>

        {/* Visual Scoop Showcase Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-14 max-w-4xl mx-auto glass-card p-6 sm:p-10 rounded-[2.5rem] relative shadow-2xl border-2 border-pink-200"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            
            <div className="bg-pink-50/80 p-5 rounded-3xl border border-pink-200/80 space-y-2">
              <div className="text-4xl">🎀</div>
              <h4 className="font-extrabold text-pink-950 text-base">Papelería Kawaii</h4>
              <p className="text-xs text-pink-700 font-medium">Stickers, lapiceros, washi tape & accesorios</p>
            </div>

            <div className="bg-purple-50/80 p-5 rounded-3xl border border-purple-200/80 space-y-2">
              <div className="text-4xl">💖</div>
              <h4 className="font-extrabold text-purple-950 text-base">Beauty Glow</h4>
              <p className="text-xs text-purple-700 font-medium">Skincare facial, maquillaje & lip gloss</p>
            </div>

            <div className="bg-amber-50/80 p-5 rounded-3xl border border-amber-200/80 space-y-2">
              <div className="text-4xl">🍬</div>
              <h4 className="font-extrabold text-amber-950 text-base">Dulcería Nacional</h4>
              <p className="text-xs text-amber-700 font-medium">Golosinas y dulces colombianos seleccionados (+25 dulces)</p>
            </div>

          </div>

          {/* CRO Trust Pill Bar */}
          <div className="mt-8 pt-6 border-t border-pink-200/60 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-extrabold text-pink-900">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-pink-500" />
              <span>+1.000 Clientes Felices</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-purple-500" />
              <span>Envíos a toda Colombia</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Experiencia 100% Sorpresa</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
