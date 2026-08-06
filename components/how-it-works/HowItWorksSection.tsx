'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Gift } from 'lucide-react';

export function HowItWorksSection() {
  const steps = [
    {
      step: 'Paso 1',
      title: 'Elige Mundo & Tamaño',
      emoji: '🌸',
      description: 'Selecciona tu mundo favorito (Papelería, Beauty o Dulces) y el tamaño de tu scoop.',
      bg: 'from-pink-100 to-rose-50',
      border: 'border-pink-200'
    },
    {
      step: 'Paso 2',
      title: 'Separa Turno con $20.000',
      emoji: '📌',
      description: 'Aparta tu turno por solo $20.000 (no reembolsable, 100% redimible en el total). ¡Preparamos y grabamos tu video!',
      bg: 'from-purple-100 to-pink-50',
      border: 'border-purple-200'
    },
    {
      step: 'Paso 3',
      title: 'Mira tu Video & Cancela el Saldo',
      emoji: '🎬',
      description: 'Mira el video de tu cucharada y paga el saldo restante antes de recibir tu paquete en casa.',
      bg: 'from-amber-100 to-yellow-50',
      border: 'border-amber-200'
    }
  ];

  return (
    <section id="como-funciona" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-extrabold border border-pink-200">
            <span>✨ Experiencia en 3 Simples Pasos</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-pink-950">
            ¿Cómo funciona la magia? 🎀
          </h2>
          <p className="text-pink-900/80 font-medium text-base sm:text-lg">
            Comprar tu cucharada sorpresa es divertido, emocionante e instintivo.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className={`glass-card p-8 rounded-[2.5rem] bg-gradient-to-b ${item.bg} border-2 ${item.border} space-y-4 relative flex flex-col justify-between`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-white text-pink-900 shadow-sm border border-pink-200">
                    {item.step}
                  </span>
                  <span className="text-4xl animate-bounce">{item.emoji}</span>
                </div>
                <h3 className="text-2xl font-extrabold text-pink-950">
                  {item.title}
                </h3>
                <p className="text-sm text-pink-900/80 leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 border-t border-pink-200/50 flex items-center justify-between text-xs font-bold text-pink-700">
                <span>Paso {idx + 1} de 3</span>
                <span>✨ 100% Sorpresa</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
