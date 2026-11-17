'use client';

import React, { useState } from 'react';
import { X, Sparkles, User, Lock, Phone, Mail, MapPin, ArrowRight, Heart, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export function AuthModal() {
  const { isAuthOpen, setIsAuthOpen, login, signup } = useAuth();

  const [tab, setTab] = useState<'login' | 'signup'>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [city, setCity] = useState('Manizales');

  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message?: string } | null>(null);

  if (!isAuthOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedback(null);

    const res = await login(email, password);
    setIsLoading(false);
    setFeedback(res);
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedback(null);

    const res = await signup({
      full_name: fullName,
      whatsapp,
      city,
      email,
      password
    });
    setIsLoading(false);
    setFeedback(res);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsAuthOpen(false)}
          className="fixed inset-0 bg-pink-950/60 backdrop-blur-md"
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border-4 border-pink-300 z-10 space-y-6"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setIsAuthOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full text-pink-400 hover:text-pink-600 hover:bg-pink-100/50 z-20 cursor-pointer focus:outline-none"
            aria-label="Cerrar modal"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="text-center space-y-1">
            <div className="text-4xl animate-bounce">💖</div>
            <h3 className="text-2xl font-black text-pink-950">
              {tab === 'login' ? '¡Hola de nuevo! ✨' : 'Únete a Sweet Scoop 🎀'}
            </h3>
            <p className="text-xs font-semibold text-pink-700">
              {tab === 'login'
                ? 'Ingresa a tu cuenta para comprar rápido y ver tus pedidos'
                : 'Crea tu cuenta para guardar tus datos de envío y cupones'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-pink-50 p-1.5 rounded-full border border-pink-200">
            <button
              onClick={() => { setTab('login'); setFeedback(null); }}
              className={`flex-1 py-2 text-xs font-black rounded-full transition-all ${
                tab === 'login'
                  ? 'bg-white text-pink-600 shadow-md border border-pink-200'
                  : 'text-pink-900/60 hover:text-pink-950'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => { setTab('signup'); setFeedback(null); }}
              className={`flex-1 py-2 text-xs font-black rounded-full transition-all ${
                tab === 'signup'
                  ? 'bg-white text-pink-600 shadow-md border border-pink-200'
                  : 'text-pink-900/60 hover:text-pink-950'
              }`}
            >
              Crear Cuenta
            </button>
          </div>

          {/* Feedback Message */}
          {feedback && (
            <div
              className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 border ${
                feedback.success
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              <Sparkles className="w-4 h-4 flex-shrink-0" />
              <span>{feedback.message}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-pink-950 mb-1">
                  Correo Electrónico *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top.1/2 top-3 text-pink-400" />
                  <input
                    type="email"
                    required
                    placeholder="ejemplo@correo.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs font-semibold rounded-2xl border border-pink-200 focus:border-pink-500 focus:outline-none bg-pink-50/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-pink-950 mb-1">
                  Contraseña *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-pink-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs font-semibold rounded-2xl border border-pink-200 focus:border-pink-500 focus:outline-none bg-pink-50/30"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-full kawaii-gradient-btn text-white font-extrabold text-xs shadow-lg hover:scale-102 transition-transform disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isLoading ? 'Ingresando...' : 'Iniciar Sesión Mágica 💖'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* SIGNUP FORM */
            <form onSubmit={handleSignupSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-extrabold text-pink-950 mb-1">
                  Nombre Completo *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-pink-400" />
                  <input
                    type="text"
                    required
                    placeholder="Tu nombre completo"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 text-xs font-semibold rounded-2xl border border-pink-200 focus:border-pink-500 focus:outline-none bg-pink-50/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-extrabold text-pink-950 mb-1">
                    WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-3 text-pink-400" />
                    <input
                      type="tel"
                      required
                      placeholder="3001234567"
                      value={whatsapp}
                      onChange={e => setWhatsapp(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-2xl border border-pink-200 focus:border-pink-500 focus:outline-none bg-pink-50/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-pink-950 mb-1">
                    Ciudad *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-3 text-pink-400" />
                    <input
                      type="text"
                      required
                      placeholder="Manizales"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-2xl border border-pink-200 focus:border-pink-500 focus:outline-none bg-pink-50/30"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-pink-950 mb-1">
                  Correo Electrónico *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-pink-400" />
                  <input
                    type="email"
                    required
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 text-xs font-semibold rounded-2xl border border-pink-200 focus:border-pink-500 focus:outline-none bg-pink-50/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-pink-950 mb-1">
                  Contraseña *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-pink-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 text-xs font-semibold rounded-2xl border border-pink-200 focus:border-pink-500 focus:outline-none bg-pink-50/30"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-full kawaii-gradient-btn text-white font-extrabold text-xs shadow-lg hover:scale-102 transition-transform disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>{isLoading ? 'Creando cuenta...' : 'Registrarme y Guardar Mis Datos ✨'}</span>
                <Heart className="w-4 h-4" />
              </button>
            </form>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
