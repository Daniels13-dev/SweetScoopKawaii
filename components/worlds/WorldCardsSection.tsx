'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, ArrowRight, CheckCircle2, Gift } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { WorldId } from '@/lib/types';
import { SCOOP_PRODUCTS } from '@/lib/constants';

export function WorldCardsSection() {
  const { setSizeModalWorld, addItem } = useCart();

  const worlds = [
    {
      id: 'kawaii' as WorldId,
      title: 'Mundo Kawaii',
      emoji: '🎀',
      subtitle: 'Papelería & Accesorios Tiernos',
      description: 'El universo perfecto para amantes de los escritorios lindos, planificadores y papelería japonesa.',
      items: ['Stickers variados', 'Lapiceros gel con figura', 'Washi Tape decorativo', 'Notas adhesivas', 'Accesorios kawaii'],
      colorBg: 'from-pink-100 via-rose-50 to-pink-50',
      borderColor: 'border-pink-300',
      badge: 'Favorito Viral 🌸'
    },
    {
      id: 'beauty' as WorldId,
      title: 'Beauty Glow',
      emoji: '💖',
      subtitle: 'Skin Care + Maquillaje Kawaii',
      description: 'Rutina de hidratación facial, labios brillantes y maquillaje tierno para resaltar tu belleza natural.',
      items: ['Mascarillas faciales', 'Maquillaje tierno', 'Lip Gloss jugoso', 'Accesorios beauty', 'Parches hidratantes'],
      colorBg: 'from-fuchsia-100 via-purple-50 to-pink-50',
      borderColor: 'border-fuchsia-300',
      badge: 'Brillo & Cuidado ✨'
    },
    {
      id: 'dulceria' as WorldId,
      title: 'Pequeñas Aventuras',
      emoji: '🍬',
      subtitle: 'Dulcería Nacional',
      description: 'Explora deliciosas golosinas y dulces colombianos seleccionados para endulzar tu momento.',
      items: ['Golosinas & Gomitas Colombianas', 'Chocolates & Masmelos', 'Dulces Acidulados', 'Galletas & Turrones', 'Mezcla Mágica de Sabores'],
      colorBg: 'from-amber-100 via-yellow-50 to-orange-50',
      borderColor: 'border-amber-300',
      badge: 'Mínimo 25 Dulces 🍭'
    }
  ];

  const handleWorldClick = (worldId: WorldId) => {
    if (worldId === 'dulceria') {
      const dulceriaProd = SCOOP_PRODUCTS.find(p => p.id === 'dulceria-cucharada');
      if (dulceriaProd) addItem(dulceriaProd, 1);
    } else {
      setSizeModalWorld(worldId);
    }
  };

  return (
    <section id="mundos" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-extrabold border border-purple-200">
            <span>✨ Explora Nuestros Mundos Temáticos</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-pink-950">
            Elige tu Universo Sorpresa 🎀
          </h2>
          <p className="text-pink-900/80 font-medium text-base sm:text-lg">
            Cada tarjeta representa una experiencia mágica única lista para ser destapada en casa.
          </p>
        </div>

        {/* 3 Giant World Cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {worlds.map((world, idx) => (
            <motion.div
              key={world.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className={`glass-card p-8 rounded-[2.5rem] bg-gradient-to-b ${world.colorBg} border-2 ${world.borderColor} flex flex-col justify-between relative shadow-xl hover:shadow-2xl transition-all group`}
            >
              <div>
                {/* Badge & Emoji Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-white/90 text-pink-950 font-black text-xs border border-pink-200 shadow-sm">
                    {world.badge}
                  </span>
                  <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
                    {world.emoji}
                  </span>
                </div>

                <h3 className="text-3xl font-black text-pink-950">
                  {world.title}
                </h3>
                <p className="text-xs font-bold text-pink-700 mt-1">
                  {world.subtitle}
                </p>
                <p className="text-sm text-pink-900/80 mt-4 leading-relaxed font-medium">
                  {world.description}
                </p>

                {/* Items Included List */}
                <div className="mt-6 pt-6 border-t border-pink-200/60 space-y-2">
                  <span className="text-xs font-extrabold text-pink-950 uppercase tracking-wider block mb-2">
                    Incluye sorpresas como:
                  </span>
                  {world.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex items-center gap-2 text-xs font-semibold text-pink-900/90">
                      <CheckCircle2 className="w-3.5 h-3.5 text-pink-500 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* World CTA Trigger Button */}
              <div className="mt-8">
                <button
                  onClick={() => handleWorldClick(world.id)}
                  className="w-full py-4 rounded-full kawaii-gradient-btn text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg group-hover:scale-102 transition-transform"
                >
                  <span>
                    {world.id === 'dulceria'
                      ? 'Agregar Cucharada Única ($30.000)'
                      : 'Escoger Tamaño & Agregar 💖'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
