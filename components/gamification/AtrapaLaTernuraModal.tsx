'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Trophy, Sparkles, Clock, Gamepad2, Ticket, Zap, AlertTriangle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { triggerConfetti } from '@/lib/utils';
import { saveGameResultToSupabase } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

interface FallingItem {
  id: number;
  emoji: string;
  x: number; // percentage
  speed: number;
  y: number; // percentage
  isTrap?: boolean;
  isGolden?: boolean;
  swayFreq?: number;
  initialX?: number;
}

interface FloatingFeedback {
  id: number;
  text: string;
  x: number;
  y: number;
  isNegative?: boolean;
}

const GOOD_EMOJIS = ['🎀', '💖', '⭐', '✨', '🌸'];
const TRAP_EMOJIS = ['💣', '👾', '🕷️'];
const GOLDEN_EMOJIS = ['👑', '🌟'];

const TARGET_SCORE = 10;
const INITIAL_TIME = 15;

export function AtrapaLaTernuraModal() {
  const { isGame1Open, setIsGame1Open, applyCoupon } = useCart();

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [items, setItems] = useState<FallingItem[]>([]);
  const [feedbacks, setFeedbacks] = useState<FloatingFeedback[]>([]);
  const [isShaking, setIsShaking] = useState(false);
  const [hasPlayedSession, setHasPlayedSession] = useState(false);

  const reqRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const played = localStorage.getItem('kawaii_game1_played');
      if (played) setHasPlayedSession(true);
    }
  }, []);

  // Timer logic
  useEffect(() => {
    if (gameState !== 'playing') return;

    if (timeLeft <= 0) {
      if (score >= TARGET_SCORE) {
        handleWin(score);
      } else {
        setGameState('lost');
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeLeft, score]);

  // Falling Items animation loop with horizontal sway and dynamic speed
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      setItems(prev => {
        if (prev.length < 6) {
          const randType = Math.random();
          let emoji = GOOD_EMOJIS[Math.floor(Math.random() * GOOD_EMOJIS.length)];
          let isTrap = false;
          let isGolden = false;

          if (randType < 0.22) {
            isTrap = true;
            emoji = TRAP_EMOJIS[Math.floor(Math.random() * TRAP_EMOJIS.length)];
          } else if (randType > 0.82) {
            isGolden = true;
            emoji = GOLDEN_EMOJIS[Math.floor(Math.random() * GOLDEN_EMOJIS.length)];
          }

          const spawnX = Math.floor(Math.random() * 70) + 15;
          const newItem: FallingItem = {
            id: Date.now() + Math.random(),
            emoji,
            x: spawnX,
            initialX: spawnX,
            speed: Math.random() * 1.3 + 1.2,
            y: 0,
            isTrap,
            isGolden,
            swayFreq: Math.random() * 0.05 + 0.02
          };
          return [...prev, newItem];
        }
        return prev;
      });
    }, 450);

    const updateLoop = () => {
      setItems(prev =>
        prev
          .map(item => {
            const nextY = item.y + item.speed;
            const sway = Math.sin(nextY * (item.swayFreq || 0.03)) * 6;
            const nextX = Math.max(10, Math.min(90, (item.initialX ?? item.x) + sway));
            return { ...item, y: nextY, x: nextX };
          })
          .filter(item => item.y < 95)
      );
      reqRef.current = requestAnimationFrame(updateLoop);
    };

    reqRef.current = requestAnimationFrame(updateLoop);

    return () => {
      clearInterval(interval);
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [gameState]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(INITIAL_TIME);
    setItems([]);
    setFeedbacks([]);
    setGameState('playing');
  };

  const addFeedback = (text: string, x: number, y: number, isNegative = false) => {
    const newFb: FloatingFeedback = { id: Date.now() + Math.random(), text, x, y, isNegative };
    setFeedbacks(prev => [...prev, newFb]);
    setTimeout(() => {
      setFeedbacks(prev => prev.filter(f => f.id !== newFb.id));
    }, 700);
  };

  useEffect(() => {
    if (gameState === 'playing' && score >= TARGET_SCORE) {
      handleWin(score);
    }
  }, [score, gameState]);

  const catchItem = (item: FallingItem) => {
    if (gameState !== 'playing') return;

    setItems(prev => prev.filter(i => i.id !== item.id));

    if (item.isTrap) {
      // Hit a trap! -2 points and screen shake
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);
      addFeedback('-2 💣', item.x, item.y, true);

      setScore(prev => Math.max(0, prev - 2));
    } else if (item.isGolden) {
      // Golden bonus! +2 points
      addFeedback('+2 👑', item.x, item.y, false);
      setScore(prev => prev + 2);
    } else {
      // Normal good item! +1 point
      addFeedback('+1', item.x, item.y, false);
      setScore(prev => prev + 1);
    }
  };

  const handleWin = (finalScore?: number) => {
    setGameState('won');
    triggerConfetti();
    applyCoupon('MAGIC10');
    if (typeof window !== 'undefined') {
      localStorage.setItem('kawaii_game1_played', 'true');
      setHasPlayedSession(true);
    }
    saveGameResultToSupabase('atrapa_la_ternura', finalScore ?? TARGET_SCORE, 'MAGIC10');
  };

  if (!isGame1Open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsGame1Open(false)}
          className="fixed inset-0 bg-pink-950/60 backdrop-blur-md"
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`relative w-full max-w-lg bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border-4 border-purple-300 z-10 space-y-6 text-center transition-transform ${
            isShaking ? 'animate-bounce border-red-400' : ''
          }`}
        >
          <button
            onClick={() => setIsGame1Open(false)}
            className="absolute top-6 right-6 p-2 rounded-full text-pink-400 hover:text-pink-600 hover:bg-pink-100/50"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-black">
              <Gamepad2 className="w-4 h-4" />
              <span>Mini-Juego Nintendo Style</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-pink-950">
              Atrapa la Ternura 🎀
            </h3>
            <p className="text-xs font-bold text-pink-700">
              Junta <strong>10 puntos</strong> en {INITIAL_TIME}s. ¡Esquiva las bombas 💣 y atrapa coronas 👑!
            </p>
          </div>

          {/* GAME CANVAS SCREEN */}
          <div className="relative h-72 rounded-3xl bg-gradient-to-b from-pink-100 via-purple-50 to-pink-200 border-2 border-purple-300 overflow-hidden shadow-inner flex flex-col justify-between p-4 select-none">
            
            {/* Top Bar inside canvas */}
            <div className="flex items-center justify-between text-xs font-black text-pink-950 z-20 bg-white/85 px-4 py-2 rounded-2xl border border-pink-200 backdrop-blur-sm shadow-sm pointer-events-none">
              <span className="flex items-center gap-1">
                <Trophy className="w-4 h-4 text-amber-500" />
                Puntos: <strong className="text-pink-600 text-sm">{score}/{TARGET_SCORE}</strong>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-purple-600" />
                Tiempo: <strong className={`text-sm ${timeLeft <= 5 ? 'text-red-600 animate-pulse font-black' : 'text-purple-700'}`}>{timeLeft}s</strong>
              </span>
            </div>

            {/* Floating Score Feedbacks (+1, +2, -2) */}
            <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
              {feedbacks.map(fb => (
                <div
                  key={fb.id}
                  style={{ left: `${fb.x}%`, top: `${fb.y}%` }}
                  className={`absolute font-black text-base sm:text-lg animate-bounce transform -translate-x-1/2 drop-shadow-md ${
                    fb.isNegative ? 'text-red-600 bg-red-100 px-2 py-0.5 rounded-full border border-red-300' : 'text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300'
                  }`}
                >
                  {fb.text}
                </div>
              ))}
            </div>

            {/* IDLE STATE */}
            {gameState === 'idle' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-white/90 backdrop-blur-sm space-y-3 z-30">
                <div className="text-4xl sm:text-5xl animate-bounce">🎀 👑 💣</div>
                <h4 className="font-extrabold text-pink-950 text-base">¡Desafío de Reflejos!</h4>
                <div className="text-[11px] text-pink-900 font-bold space-y-1 bg-purple-50 p-3 rounded-2xl border border-purple-200 max-w-xs text-left">
                  <p>✨ Atrapa íconos kawaii = <strong>+1 pt</strong></p>
                  <p>👑 Coronas doradas = <strong>+2 pts</strong></p>
                  <p>💣 Bombas y monstruos = <strong>-2 pts ⚠️</strong></p>
                </div>
                <button
                  onClick={startGame}
                  className="px-8 py-3 rounded-full kawaii-gradient-btn text-white font-extrabold text-sm shadow-xl hover:scale-105 transition-transform cursor-pointer"
                >
                  ¡Iniciar Juego! 🎮
                </button>
              </div>
            )}

            {/* PLAYING STATE: FALLING OBJECTS */}
            {gameState === 'playing' && (
              <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
                {items.map(item => (
                  <button
                    key={item.id}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      catchItem(item);
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    style={{
                      left: `${item.x}%`,
                      top: `${item.y}%`
                    }}
                    className={`absolute p-2.5 text-3xl sm:text-4xl transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 active:scale-90 transition-transform cursor-pointer pointer-events-auto select-none touch-none focus:outline-none drop-shadow-md ${
                      item.isGolden
                        ? 'animate-bounce ring-4 ring-amber-300 rounded-full bg-amber-100/80'
                        : item.isTrap
                        ? 'animate-pulse scale-110'
                        : 'animate-pulse'
                    }`}
                  >
                    {item.emoji}
                  </button>
                ))}
              </div>
            )}

            {/* WON STATE */}
            {gameState === 'won' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-white/95 backdrop-blur-sm space-y-3 z-30">
                <div className="text-5xl animate-bounce">🎉 🏆 ✨</div>
                <h4 className="font-black text-pink-950 text-xl">¡FELICITACIONES!</h4>
                <p className="text-xs font-bold text-pink-800">
                  ¡Atrapaste los 10 puntos mágicos y ganaste!
                </p>
                <div className="bg-pink-100 text-pink-800 px-4 py-2 rounded-2xl border border-pink-300 font-black text-sm flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-pink-600" />
                  <span>Cupón Aplicado: <strong>MAGIC10</strong> (10% OFF)</span>
                </div>
                <button
                  onClick={() => setIsGame1Open(false)}
                  className="mt-2 px-6 py-2.5 rounded-full kawaii-gradient-btn text-white font-extrabold text-xs shadow-md cursor-pointer"
                >
                  Ir al Carrito a Usar mi Descuento 💖
                </button>
              </div>
            )}

            {/* LOST STATE */}
            {gameState === 'lost' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-white/95 backdrop-blur-sm space-y-3 z-30">
                <div className="text-5xl">😿</div>
                <h4 className="font-black text-pink-950 text-lg">¡Tiempo Agotado!</h4>
                <p className="text-xs text-pink-800 font-bold">
                  Conseguiste {score} de {TARGET_SCORE} puntos. ¡Ten cuidado con las bombas!
                </p>
                <button
                  onClick={startGame}
                  className="px-6 py-2.5 rounded-full kawaii-gradient-btn text-white font-extrabold text-xs shadow-md cursor-pointer"
                >
                  Intentar de Nuevo 🔄
                </button>
              </div>
            )}

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}


