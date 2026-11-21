'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Filter, Check, Crown, Flame, Dices, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { WorldId, CharmRarity, Charm } from '@/lib/types';
import { getCharmsByWorld, simulateScoop } from '@/lib/charms';
import { triggerConfetti } from '@/lib/utils';

export function CharmsBoardModal() {
  const {
    isCharmsModalOpen,
    setIsCharmsModalOpen,
    charmsModalWorld,
    setCharmsModalWorld
  } = useCart();

  const [rarityFilter, setRarityFilter] = useState<'all' | CharmRarity>('all');
  const [scoopResult, setScoopResult] = useState<Charm[] | null>(null);
  const [isScooping, setIsScooping] = useState(false);

  if (!isCharmsModalOpen) return null;

  const charms = getCharmsByWorld(charmsModalWorld);
  const filteredCharms = charms.filter(c => rarityFilter === 'all' || c.rarity === rarityFilter);

  const worldTitles: Record<WorldId, { title: string; emoji: string; count: number; desc: string }> = {
    kawaii: { title: 'Mundo Kawaii', emoji: '🎀', count: 30, desc: 'Papelería, llaveros y ternura japonesa/coreana' },
    beauty: { title: 'Beauty Glow', emoji: '💖', count: 25, desc: 'Skincare, bálsamos jugosos y accesorios de spa' },
    dulceria: { title: 'Pequeñas Aventuras', emoji: '🍬', count: 20, desc: 'Dulces, golosinas y delicias nacionales' }
  };

  const handleRunScoop = () => {
    setIsScooping(true);
    setScoopResult(null);

    setTimeout(() => {
      const results = simulateScoop(charmsModalWorld, 5);
      setScoopResult(results);
      setIsScooping(false);
      triggerConfetti();
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCharmsModalOpen(false)}
          className="fixed inset-0 bg-pink-950/40 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white w-full max-w-4xl max-h-[92vh] rounded-[2.5rem] shadow-2xl border-4 border-pink-200 flex flex-col overflow-hidden z-10"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 text-white p-5 sm:p-6 relative">
            <button
              onClick={() => setIsCharmsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-white/20 rounded-2xl text-2xl backdrop-blur-md">
                ✨
              </span>
              <div>
                <h3 className="text-xl sm:text-2xl font-black flex items-center gap-2">
                  Tablero Mágico de Dijes
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/30 font-bold uppercase tracking-wider">
                    {worldTitles[charmsModalWorld].count} Dijes
                  </span>
                </h3>
                <p className="text-pink-100 text-xs sm:text-sm font-medium">
                  {worldTitles[charmsModalWorld].desc} • Cada dije representa una sorpresa real
                </p>
              </div>
            </div>

            {/* World Switcher Tabs */}
            <div className="grid grid-cols-3 gap-2 mt-5 bg-black/15 p-1 rounded-2xl backdrop-blur-sm">
              {(['kawaii', 'beauty', 'dulceria'] as WorldId[]).map(world => {
                const isSelected = charmsModalWorld === world;
                const info = worldTitles[world];
                return (
                  <button
                    key={world}
                    onClick={() => {
                      setCharmsModalWorld(world);
                      setScoopResult(null);
                    }}
                    className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2 px-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                      isSelected
                        ? 'bg-white text-pink-900 shadow-md scale-[1.02]'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span>{info.emoji}</span>
                    <span className="truncate">{info.title}</span>
                    <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.2 rounded-full bg-pink-100 text-pink-800 font-black">
                      {info.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Bar (Filters + Virtual Scoop Trigger) */}
          <div className="p-4 sm:p-5 bg-pink-50/60 border-b border-pink-100 flex flex-wrap items-center justify-between gap-3">
            {/* Rarity filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-black text-pink-900/60 flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5" /> Rareza:
              </span>
              {[
                { key: 'all', label: 'Todos' },
                { key: 'comun', label: 'Común' },
                { key: 'raro', label: 'Raro ✨' },
                { key: 'legendario', label: 'Legendario 👑' }
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setRarityFilter(f.key as any)}
                  className={`px-3 py-1 rounded-full text-xs font-extrabold transition-all ${
                    rarityFilter === f.key
                      ? 'bg-pink-600 text-white shadow-sm'
                      : 'bg-white text-pink-950/70 border border-pink-200 hover:border-pink-300'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Virtual Scoop Simulator Button */}
            <button
              onClick={handleRunScoop}
              disabled={isScooping}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Dices className={`w-4 h-4 ${isScooping ? 'animate-spin' : ''}`} />
              <span>{isScooping ? 'Revolviendo la cuchara...' : '🥄 Probar Suerte (Scoop Virtual)'}</span>
            </button>
          </div>

          {/* Virtual Scoop Result Banner (if active) */}
          <AnimatePresence>
            {scoopResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gradient-to-r from-yellow-50 via-pink-50 to-purple-50 border-b-2 border-yellow-300 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500 animate-bounce" />
                    <span className="text-xs sm:text-sm font-black text-pink-950">
                      ¡Tu Scoop Virtual sacó estos 5 dijes de la suerte!
                    </span>
                  </div>
                  <button
                    onClick={() => setScoopResult(null)}
                    className="text-xs font-bold text-pink-700 hover:underline"
                  >
                    Ocultar
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {scoopResult.map((charm, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ scale: 0, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`p-2.5 rounded-2xl border text-center flex flex-col items-center justify-between shadow-sm ${
                        charm.rarity === 'legendario'
                          ? 'bg-amber-100 border-amber-400 ring-2 ring-amber-300'
                          : charm.rarity === 'raro'
                          ? 'bg-purple-100 border-purple-300'
                          : 'bg-white border-pink-200'
                      }`}
                    >
                      <span className="text-2xl mb-1">{charm.emoji}</span>
                      <p className="font-extrabold text-[11px] text-pink-950 line-clamp-1">{charm.name}</p>
                      <span className="text-[9px] font-bold text-pink-700 line-clamp-1">{charm.reward}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Charms Grid Display */}
          <div className="p-4 sm:p-6 overflow-y-auto max-h-[55vh] sm:max-h-[60vh]">
            <div className="mb-4">
              <p className="text-xs sm:text-sm font-black text-pink-900">
                Explora todos los dijes oficiales y descubre qué premios sorpresa puedes obtener en cada scoop:
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {filteredCharms.map(charm => {
                const isLegendary = charm.rarity === 'legendario';
                const isRare = charm.rarity === 'raro';

                return (
                  <motion.div
                    key={charm.id}
                    whileHover={{ scale: 1.03 }}
                    className={`relative p-3 rounded-2xl border-2 transition-all flex flex-col justify-between text-center select-none ${
                      isLegendary
                        ? 'border-amber-300 bg-gradient-to-b from-amber-50 to-yellow-50 shadow-sm'
                        : isRare
                        ? 'border-purple-200 bg-gradient-to-b from-purple-50 to-pink-50 shadow-sm'
                        : 'border-pink-100 bg-white hover:border-pink-300 hover:shadow-sm'
                    }`}
                  >
                    {/* Top indicator badge */}
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase ${
                          isLegendary
                            ? 'bg-amber-400 text-amber-950'
                            : isRare
                            ? 'bg-purple-200 text-purple-900'
                            : 'bg-pink-100 text-pink-700'
                        }`}
                      >
                        {charm.rarity}
                      </span>
                    </div>

                    {/* Emoji + Icon */}
                    <div className="my-1.5">
                      <span className="text-3xl inline-block drop-shadow-sm">{charm.emoji}</span>
                    </div>

                    {/* Info */}
                    <div>
                      <h4 className="font-black text-xs text-pink-950 line-clamp-1">{charm.name}</h4>
                      <p className="text-[10px] text-pink-800/80 font-medium leading-tight mt-1 line-clamp-2">
                        {charm.reward}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Footer note & action */}
          <div className="p-4 bg-pink-50/50 border-t border-pink-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-pink-900/80 font-medium text-center sm:text-left">
              <Sparkles className="w-4 h-4 text-pink-500 shrink-0" />
              <span>
                Cada scoop es una experiencia sorpresa 100% aleatoria y llena de magia ✨
              </span>
            </div>

            <button
              onClick={() => setIsCharmsModalOpen(false)}
              className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              Cerrar Tablero 💖
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
