'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Sparkles, MessageCircle, ShieldCheck, Heart, Truck, Gift, Video, Wallet } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { buildWhatsAppQuickCartLink } from '@/lib/utils';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  icon: string;
  badge?: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    icon: '🥄',
    badge: 'Paso 1',
    question: '¿Cómo funciona la experiencia Sweet Scoop?',
    answer: 'Eliges tu mundo favorito (Mundo Kawaii 🎀, Beauty Glow 💖 o Dulcería Nacional 🍬) y seleccionas el tamaño de tu cucharada. Cada scoop contiene una combinación sorpresa de productos mágicos seleccionados con amor tierno.'
  },
  {
    id: 'faq-2',
    icon: '📌',
    badge: 'Abono de Turno',
    question: '¿Cómo se separa el turno y cómo funciona el abono de $20.000?',
    answer: 'Al finalizar tu pedido en la web, serás redirigido a WhatsApp. Para agendar el turno de armado y grabación de tu video personalizado, realizas un abono de $20.000 COP (Nequi, Daviplata o Bancolombia). Este abono se descuenta del valor total de tu compra.'
  },
  {
    id: 'faq-3',
    icon: '🎬',
    badge: 'Video Exclusivo',
    question: '¿Cómo y cuándo veo el video de mi cucharada?',
    answer: '¡Es la parte más emocionante! Una vez sea tu turno de armado, grabamos un video lindo preparando tu scoop y te lo enviamos a tu WhatsApp para que veas todos los tesoros que te tocaron antes del envío.'
  },
  {
    id: 'faq-4',
    icon: '💰',
    badge: 'Pago de Saldo',
    question: '¿Cuándo se cancela el saldo restante?',
    answer: 'El saldo restante (Total del pedido menos los $20.000 de abono) se cancela tras recibir tu video de confirmación y justo antes de generar tu guía de despacho.'
  },
  {
    id: 'faq-5',
    icon: '🚚',
    badge: 'Envíos Nacionales',
    question: '¿Hacen envíos a toda Colombia y cuánto tardan?',
    answer: '¡Sí! Despachamos desde Manizales a todas las ciudades y municipios de Colombia vía transportadora rápida (entre 1 a 3 días hábiles).'
  },
  {
    id: 'faq-6',
    icon: '🎁',
    badge: 'Sorpresa Gratis',
    question: '¿Qué es la Sorpresa Mágica GRATIS por llevar 2 o más scoops?',
    answer: 'Al agregar 2 o más cucharadas a tu carrito, el sistema desbloquea automáticamente un regalo sorpresa exclusivo que se añade a tu pedido sin costo adicional.'
  },
  {
    id: 'faq-7',
    icon: '💌',
    badge: 'Para Regalos',
    question: '¿Puedo enviar un Scoop como regalo con nota personalizada?',
    answer: '¡Nos encanta ser cómplices de sorpresas! Al confirmarnos por WhatsApp nos indicas el nombre de la persona y tu mensaje especial, y nosotros incluiremos una linda tarjeta con dedicatoria totalmente gratis.'
  }
];

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const { items, totals, coupon } = useCart();

  const whatsappUrl = buildWhatsAppQuickCartLink(items, totals, coupon);

  const toggleFaq = (id: string) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-20 relative overflow-hidden">
      
      {/* Floating Sparkles in Background */}
      <div className="absolute top-10 right-10 text-4xl opacity-30 animate-pulse pointer-events-none">✨</div>
      <div className="absolute bottom-10 left-10 text-4xl opacity-30 animate-bounce pointer-events-none">💖</div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        
        {/* Header Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 text-pink-700 font-extrabold text-xs border border-pink-200 shadow-sm">
            <HelpCircle className="w-4 h-4 text-pink-500" />
            <span>Resolvemos tus Dudas Mágicas</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-pink-950 tracking-tight">
            Preguntas Frecuentes &{' '}
            <span className="kawaii-gradient-text">Forma de Trabajo 🌸</span>
          </h2>

          <p className="text-sm sm:text-base text-pink-900/80 font-medium max-w-xl mx-auto">
            Conoce todo sobre la reserva de turnos, preparación de videos y envíos de tus cucharadas sorpresa en Colombia.
          </p>
        </div>

        {/* Process Highlights Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card p-4 rounded-2xl flex items-center gap-3 border border-pink-200 text-left">
            <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center text-xl flex-shrink-0">
              📌
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-pink-950">1. Reserva con $20.000</h4>
              <p className="text-[11px] text-pink-800 font-medium">Abono 100% abonable a tu total</p>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl flex items-center gap-3 border border-purple-200 text-left">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-xl flex-shrink-0">
              🎬
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-pink-950">2. Video Personalizado</h4>
              <p className="text-[11px] text-pink-800 font-medium">Ves tu armado por WhatsApp</p>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl flex items-center gap-3 border border-emerald-200 text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-xl flex-shrink-0">
              🚚
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-pink-950">3. Envío Seguro</h4>
              <p className="text-[11px] text-pink-800 font-medium">Cobertura a toda Colombia</p>
            </div>
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {FAQ_ITEMS.map(item => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="glass-card rounded-3xl border border-pink-200 overflow-hidden transition-all duration-200 shadow-sm"
              >
                <button
                  onClick={() => toggleFaq(item.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="text-2xl p-2 rounded-2xl bg-pink-50 border border-pink-100">
                      {item.icon}
                    </span>
                    <div>
                      {item.badge && (
                        <span className="text-[10px] font-black uppercase tracking-wider text-pink-600 bg-pink-100/80 px-2 py-0.5 rounded-full inline-block mb-1 border border-pink-200">
                          {item.badge}
                        </span>
                      )}
                      <h3 className="font-extrabold text-sm sm:text-base text-pink-950">
                        {item.question}
                      </h3>
                    </div>
                  </div>

                  <div className={`p-2 rounded-full transition-transform duration-300 ${isOpen ? 'rotate-180 bg-pink-100 text-pink-600' : 'bg-pink-50 text-pink-400'}`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-6 sm:px-6 pt-1 text-xs sm:text-sm text-pink-900/85 font-medium leading-relaxed border-t border-pink-100/80">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Box */}
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 text-white rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-xl border-2 border-pink-300">
          <div className="text-4xl animate-bounce">💬</div>
          <h3 className="font-black text-xl sm:text-2xl">
            ¿Tienes otra pregunta sobre tu pedido?
          </h3>
          <p className="text-xs sm:text-sm text-pink-100 font-semibold max-w-md mx-auto">
            Estamos listos para asesorarte personalmente por WhatsApp y resolver cualquier duda al instante.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-pink-950 font-black text-xs sm:text-sm hover:scale-105 transition-transform shadow-lg"
          >
            <MessageCircle className="w-4 h-4 text-emerald-500 fill-emerald-500" />
            <span>Hablar con un Asesor Kawaii en WhatsApp 💖</span>
          </a>
        </div>

      </div>
    </section>
  );
}
