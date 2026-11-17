'use client';

import React from 'react';
import { Heart, MapPin, Truck, ShieldCheck, Sparkles, Phone } from 'lucide-react';
import { WHATSAPP_PHONE } from '@/lib/constants';
import { useCart } from '@/context/CartContext';
import { buildWhatsAppQuickCartLink } from '@/lib/utils';

export function Footer() {
  const { items, totals, coupon } = useCart();
  const whatsappUrl = buildWhatsAppQuickCartLink(items, totals, coupon);

  return (
    <footer className="w-full bg-gradient-to-b from-pink-50/60 via-pink-100/80 to-[#fce7f3] border-t border-pink-200/60 pt-10 pb-[calc(2rem+env(safe-area-inset-bottom))] mt-12 text-pink-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🎀</span>
              <span className="font-extrabold text-2xl kawaii-gradient-text">
                Sweet Scoop
              </span>
            </div>
            <p className="text-sm text-pink-900/80 leading-relaxed font-medium">
              Vendemos emoción, curiosidad y momentos mágicos en Colombia. Cada cucharada sorpresa contiene tesoros seleccionados con amor tierno.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-pink-700 bg-white/70 px-3 py-1.5 rounded-full w-fit border border-pink-200 shadow-sm">
              <MapPin className="w-4 h-4 text-pink-500" />
              <span>Manizales, Caldas — Envíos a toda Colombia 🇨🇴</span>
            </div>
          </div>

          {/* Worlds Quick Access */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-pink-900 text-sm tracking-wider uppercase flex items-center gap-1.5">
              <span>🌸</span> Nuestros Mundos
            </h4>
            <ul className="space-y-2 text-sm font-medium text-pink-900/80">
              <li><a href="#mundos" className="hover:text-pink-600 transition-colors">🎀 Mundo Kawaii (Papelería)</a></li>
              <li><a href="#mundos" className="hover:text-pink-600 transition-colors">💖 Beauty Glow (Skincare + Makeup)</a></li>
              <li><a href="#mundos" className="hover:text-pink-600 transition-colors">🍬 Pequeñas Aventuras (Dulces)</a></li>
              <li><a href="#comparacion" className="hover:text-pink-600 transition-colors font-bold text-pink-600">🥄 Guía de Tamaños</a></li>
            </ul>
          </div>

          {/* Trust Badges */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-pink-900 text-sm tracking-wider uppercase flex items-center gap-1.5">
              <span>✨</span> Garantía & Amor
            </h4>
            <div className="space-y-2 text-xs font-semibold text-pink-900/90">
              <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-2xl border border-pink-200">
                <Truck className="w-5 h-5 text-pink-500 flex-shrink-0" />
                <span>Envíos Seguros a Toda Colombia</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-2xl border border-pink-200">
                <ShieldCheck className="w-5 h-5 text-purple-500 flex-shrink-0" />
                <span>100% Experiencia Sorpresa Feliz</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-2xl border border-pink-200">
                <Heart className="w-5 h-5 text-rose-500 flex-shrink-0" />
                <span>+1.000 Clientes Felices</span>
              </div>
            </div>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-pink-900 text-sm tracking-wider uppercase flex items-center gap-1.5">
              <span>💌</span> Contacto Kawaii
            </h4>
            <p className="text-xs text-pink-900/80">¿Tienes alguna pregunta o inquietud?</p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-500 text-white font-bold text-xs hover:bg-emerald-600 transition-all shadow-md w-fit"
            >
              <Phone className="w-4 h-4" />
              <span>{items.length > 0 ? `Enviar Mi Carrito (${items.length})` : 'WhatsApp: 3104494494'}</span>
            </a>
            <div className="pt-2 flex items-center gap-3">
              <span className="text-xs font-bold text-pink-700">Manizales, Colombia</span>
            </div>
          </div>
        </div>


        {/* Bottom Bar */}
        <div className="border-t border-pink-200/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-pink-800/70">
          <p>© {new Date().getFullYear()} Sweet Scoop Kawaii. Todos los derechos reservados.</p>
          <div className="flex items-center gap-1">
            <span>Hecho con</span>
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 animate-pulse" />
            <span>para fanáticos del Kawaii en Colombia</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
