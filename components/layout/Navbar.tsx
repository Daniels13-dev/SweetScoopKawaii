'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Sparkles, Gamepad2, Gift, User, LogIn, ChevronDown, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const { totals, setIsCartOpen, setIsGame1Open, setIsGame2Open } = useCart();
  const { user, setIsAuthOpen, setIsAccountOpen } = useAuth();
  
  const [scrolled, setScrolled] = useState(false);
  const [gamesOpen, setGamesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'glass-panel py-2.5 shadow-md'
          : 'bg-white/70 backdrop-blur-md py-4 border-b border-pink-100/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-xl shadow-inner border border-pink-200 flex-shrink-0"
          >
            🎀
          </motion.div>
          <div>
            <span className="font-black text-xl sm:text-2xl tracking-tight kawaii-gradient-text">
              Sweet Scoop
            </span>
            <span className="text-[10px] ml-1 bg-pink-100 text-pink-600 font-black px-2 py-0.5 rounded-full border border-pink-200 inline-block">
              Kawaii ✨
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 font-bold text-sm text-pink-900/80">
          <a href="#mundos" className="hover:text-pink-600 transition-colors flex items-center gap-1">
            ✨ Mundos
          </a>
          <a href="#comparacion" className="hover:text-pink-600 transition-colors flex items-center gap-1 text-pink-600 font-extrabold">
            🥄 Tamaños
          </a>
          <a href="#como-funciona" className="hover:text-pink-600 transition-colors flex items-center gap-1">
            🌸 Cómo Funciona
          </a>
          <a href="#faq" className="hover:text-pink-600 transition-colors flex items-center gap-1">
            ❓ Preguntas
          </a>
        </nav>

        {/* Action Controls Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Unified Games Dropdown Trigger */}
          <div className="relative">
            <button
              onClick={() => setGamesOpen(!gamesOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-900 font-black hover:scale-105 transition-transform border border-purple-200 text-xs shadow-sm cursor-pointer"
            >
              <Gamepad2 className="w-4 h-4 text-purple-600 animate-pulse" />
              <span className="hidden sm:inline">Juegos & Premios</span>
              <span className="sm:hidden">Juegos</span>
              <ChevronDown className={`w-3.5 h-3.5 text-purple-600 transition-transform ${gamesOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Games Dropdown Menu */}
            <AnimatePresence>
              {gamesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-60 bg-white rounded-3xl p-2.5 shadow-2xl border-2 border-purple-200 z-50 space-y-1 text-left"
                >
                  <button
                    onClick={() => { setIsGame1Open(true); setGamesOpen(false); }}
                    className="w-full p-2.5 rounded-2xl hover:bg-purple-50 flex items-center gap-3 text-xs font-bold text-pink-950 transition-colors cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-2xl bg-purple-100 flex items-center justify-center text-xl flex-shrink-0">
                      🎀
                    </div>
                    <div>
                      <div className="font-extrabold text-purple-950 text-xs">Atrapa la Ternura</div>
                      <div className="text-[10px] text-purple-700 font-medium">Mini-juego de reflejos 10% OFF</div>
                    </div>
                  </button>

                  <button
                    onClick={() => { setIsGame2Open(true); setGamesOpen(false); }}
                    className="w-full p-2.5 rounded-2xl hover:bg-amber-50 flex items-center gap-3 text-xs font-bold text-pink-950 transition-colors cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-2xl bg-amber-100 flex items-center justify-center text-xl flex-shrink-0">
                      🎡
                    </div>
                    <div>
                      <div className="font-extrabold text-amber-950 text-xs">Ruleta del Destino</div>
                      <div className="text-[10px] text-amber-800 font-medium">Gira y gana premio mágico</div>
                    </div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Account Control */}
          {user ? (
            <button
              onClick={() => setIsAccountOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-100/80 text-pink-900 text-xs font-black hover:bg-pink-200 transition-colors border border-pink-200 shadow-sm cursor-pointer"
              title="Mi Cuenta Kawaii"
            >
              <User className="w-3.5 h-3.5 text-pink-600" />
              <span className="max-w-[70px] truncate hidden sm:inline">{user.full_name.split(' ')[0]}</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAuthOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 text-purple-900 text-xs font-black hover:bg-purple-100 transition-colors border border-purple-200 shadow-sm cursor-pointer"
              title="Iniciar Sesión"
            >
              <LogIn className="w-3.5 h-3.5 text-purple-600" />
              <span className="hidden sm:inline">Ingresar</span>
            </button>
          )}

          {/* Cart Trigger Button */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center justify-center p-2.5 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md hover:scale-105 transition-transform border-2 border-white cursor-pointer"
            aria-label="Ver carrito"
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            {totals.totalScoopsCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-pink-950 text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md border border-white"
              >
                {totals.totalScoopsCount}
              </motion.span>
            )}
          </motion.button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-full text-pink-700 hover:bg-pink-100 transition-colors cursor-pointer ml-1"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/95 backdrop-blur-md border-b border-pink-200 overflow-hidden px-6 py-4 space-y-3 font-bold text-sm text-pink-950"
          >
            <a
              href="#mundos"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 border-b border-pink-100 flex items-center gap-2"
            >
              ✨ Nuestros Mundos
            </a>
            <a
              href="#comparacion"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 border-b border-pink-100 flex items-center gap-2 text-pink-600 font-extrabold"
            >
              🥄 Guía de Tamaños
            </a>
            <a
              href="#como-funciona"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 border-b border-pink-100 flex items-center gap-2"
            >
              🌸 Cómo Funciona
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 flex items-center gap-2"
            >
              ❓ Preguntas Frecuentes
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

