'use client';

import React, { useState, useEffect } from 'react';
import { X, Gift, Sparkles, Trophy, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { WHEEL_PRIZES } from '@/lib/constants';
import { PrizeOption } from '@/lib/types';
import { triggerConfetti } from '@/lib/utils';
import { saveGameResultToSupabase } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

export function RuletaDelDestinoModal() {
  const { isGame2Open, setIsGame2Open, applyCoupon } = useCart();

  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<PrizeOption | null>(null);
  const [hasSpun, setHasSpun] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPrize = localStorage.getItem('kawaii_wheel_prize');
      if (savedPrize) {
        setWonPrize(JSON.parse(savedPrize));
        setHasSpun(true);
      }
    }
  }, []);

  const spinWheel = () => {
    if (spinning || hasSpun) return;

    setSpinning(true);

    // Pick a random prize index
    const prizeIndex = Math.floor(Math.random() * WHEEL_PRIZES.length);
    const prize = WHEEL_PRIZES[prizeIndex];

    const segmentAngle = 360 / WHEEL_PRIZES.length;
    const targetDegree = 360 * 5 + (360 - prizeIndex * segmentAngle - segmentAngle / 2);

    setRotation(targetDegree);

    setTimeout(() => {
      setSpinning(false);
      setWonPrize(prize);
      setHasSpun(true);
      triggerConfetti();

      if (prize.code) {
        applyCoupon(prize.code);
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('kawaii_wheel_prize', JSON.stringify(prize));
      }

      saveGameResultToSupabase('ruleta_del_destino', 100, prize.name);
    }, 4500);
  };

  if (!isGame2Open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsGame2Open(false)}
          className="fixed inset-0 bg-pink-950/60 backdrop-blur-md"
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border-4 border-amber-300 z-10 space-y-6 text-center"
        >
          <button
            onClick={() => setIsGame2Open(false)}
            className="absolute top-6 right-6 p-2 rounded-full text-pink-400 hover:text-pink-600 hover:bg-pink-100/50"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black">
              <Gift className="w-4 h-4 text-amber-600 animate-spin" />
              <span>Una Oportunidad Mágica por Visita</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-pink-950">
              Ruleta del Destino Kawaii 🎡
            </h3>
            <p className="text-xs font-bold text-pink-700">
              ¡Gira la ruleta y manifiesta tu premio exclusivo para tu pedido!
            </p>
          </div>

          {/* WHEEL DISPLAY CONTAINER */}
          <div className="relative w-64 h-64 mx-auto flex items-center justify-center my-4">
            
            {/* Top Pointer Arrow Indicator */}
            <div className="absolute -top-3 z-30 text-3xl animate-bounce text-pink-600 drop-shadow-md">
              🔻
            </div>

            {/* Wheel Canvas Graphic */}
            <div
              className="w-full h-full rounded-full border-4 border-amber-300 shadow-2xl relative overflow-hidden transition-transform duration-[4500ms] cubic-bezier(0.15, 0.9, 0.2, 1)"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              {WHEEL_PRIZES.map((prize, idx) => {
                const angle = (360 / WHEEL_PRIZES.length) * idx;
                return (
                  <div
                    key={prize.id}
                    className="absolute w-full h-full text-xs font-black flex items-start justify-center pt-4"
                    style={{
                      transform: `rotate(${angle}deg)`,
                      transformOrigin: '50% 50%',
                      backgroundColor: prize.color
                    }}
                  >
                    <span className="bg-white/80 px-2 py-0.5 rounded-full border border-pink-200 shadow-sm text-[10px] text-pink-950 font-bold max-w-[80px] truncate">
                      {prize.emoji} {prize.name.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Center Pointer Cap */}
            <div className="absolute w-12 h-12 rounded-full bg-white border-4 border-amber-400 shadow-lg flex items-center justify-center z-20 text-xl font-bold text-pink-600">
              🎀
            </div>

          </div>

          {/* WON PRIZE NOTIFICATION OR SPIN BUTTON */}
          {wonPrize ? (
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-2">
              <div className="flex items-center justify-center gap-1.5 text-amber-900 font-extrabold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>¡Tu Premio Obtenido: {wonPrize.name}!</span>
              </div>
              <p className="text-xs text-pink-800 font-bold">
                Tu premio ha sido guardado y aplicado a tu pedido.
              </p>
              <button
                onClick={() => setIsGame2Open(false)}
                className="mt-2 px-6 py-2.5 rounded-full kawaii-gradient-btn text-white font-extrabold text-xs shadow-md"
              >
                Usar mi Premio en la Compra 💖
              </button>
            </div>
          ) : (
            <button
              onClick={spinWheel}
              disabled={spinning || hasSpun}
              className="w-full py-4 rounded-full kawaii-gradient-btn text-white font-extrabold text-base shadow-xl hover:scale-102 transition-transform disabled:opacity-50"
            >
              {spinning ? 'GIRANDO LA MAGIA... 🎡' : '¡Girar Ruleta Mágica! 💖'}
            </button>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
