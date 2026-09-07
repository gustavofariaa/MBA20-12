'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/useGameStore';
import { VINTAGE_COLOR_OPTIONS, VINTAGE_ICON_OPTIONS } from '@/data/playerCustomization';
import { PlayerCustomizationModal, CustomizationTarget } from './PlayerCustomizationModal';
import { PlayerIcon } from '@/components/common/PlayerIcon';
import { Sparkles, Users, Play, Info, ShieldCheck, Paintbrush } from 'lucide-react';

export const LobbyForm: React.FC = () => {
  const startGame = useGameStore((state) => state.startGame);

  const [playerCount, setPlayerCount] = useState<number>(2);
  const [editingPlayerIndex, setEditingPlayerIndex] = useState<number | null>(null);
  const [isSubmitVisible, setIsSubmitVisible] = useState<boolean>(true);

  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const [playersSetup, setPlayersSetup] = useState<CustomizationTarget[]>([
    { name: 'Scrum Master', colorId: 'red', iconSymbol: 'rocket' },
    { name: 'Product Owner', colorId: 'blue', iconSymbol: 'bolt' },
    { name: 'Tech Lead', colorId: 'yellow', iconSymbol: 'star' },
    { name: 'QA Specialist', colorId: 'green', iconSymbol: 'clover' }
  ]);

  // IntersectionObserver to detect when the main JOGAR button scrolls off-screen
  useEffect(() => {
    if (!submitButtonRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSubmitVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(submitButtonRef.current);
    return () => observer.disconnect();
  }, []);

  const handleCountChange = (count: number) => {
    setPlayerCount(count);
    setPlayersSetup((prev) => {
      const updated = [...prev];
      for (let i = 0; i < count; i++) {
        const usedColors = updated.slice(0, i).map((p) => p.colorId);
        const usedIcons = updated.slice(0, i).map((p) => p.iconSymbol);

        if (usedColors.includes(updated[i].colorId)) {
          const availableColor = VINTAGE_COLOR_OPTIONS.find((c) => !usedColors.includes(c.id));
          if (availableColor) {
            updated[i] = { ...updated[i], colorId: availableColor.id };
          }
        }

        if (usedIcons.includes(updated[i].iconSymbol)) {
          const availableIcon = VINTAGE_ICON_OPTIONS.find((ic) => !usedIcons.includes(ic.symbol));
          if (availableIcon) {
            updated[i] = { ...updated[i], iconSymbol: availableIcon.symbol };
          }
        }
      }
      return updated;
    });
  };

  const handleNameChange = (index: number, name: string) => {
    setPlayersSetup((prev) =>
      prev.map((p, i) => (i === index ? { ...p, name } : p))
    );
  };

  const handleSaveCustomization = (colorId: string, iconSymbol: string) => {
    if (editingPlayerIndex === null) return;
    setPlayersSetup((prev) =>
      prev.map((p, i) => (i === editingPlayerIndex ? { ...p, colorId, iconSymbol } : p))
    );
  };

  const isFormInvalid = playersSetup.slice(0, playerCount).some((p) => !p.name.trim());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormInvalid) return;

    const activeInputs: CustomizationTarget[] = [];
    for (let i = 0; i < playerCount; i++) {
      const p = playersSetup[i];
      const usedColors = activeInputs.map((a) => a.colorId);
      const usedIcons = activeInputs.map((a) => a.iconSymbol);

      let colorId = p.colorId;
      if (usedColors.includes(colorId)) {
        const freeColor = VINTAGE_COLOR_OPTIONS.find((c) => !usedColors.includes(c.id));
        if (freeColor) colorId = freeColor.id;
      }

      let iconSymbol = p.iconSymbol;
      if (usedIcons.includes(iconSymbol)) {
        const freeIcon = VINTAGE_ICON_OPTIONS.find((ic) => !usedIcons.includes(ic.symbol));
        if (freeIcon) iconSymbol = freeIcon.symbol;
      }

      activeInputs.push({
        name: p.name.trim(),
        colorId,
        iconSymbol
      });
    }

    startGame(activeInputs);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-2 sm:p-4 md:p-6">
      <div className="relative overflow-hidden rounded-2xl bg-[#FAF5E4] border-4 border-[#1C1917] shadow-[8px_8px_0px_0px_rgba(28,25,23,1)] p-5 sm:p-8 md:p-10 text-[#1C1917]">
        {/* Game Badge & Header */}
        <div className="text-center space-y-3 mb-6 sm:mb-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-5 py-1.5 rounded-full bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#F59E0B] border-3 border-[#1C1917] shadow-[3px_3px_0px_0px_rgba(28,25,23,1)] text-[#1C1917] text-[11px] sm:text-xs font-cartoon uppercase tracking-widest transition-transform hover:scale-105">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#1C1917] text-[#1C1917]" />
            <span>Edição Gestão Ágil</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#1C1917]" />
            <span>Sprint & Deploy</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-cartoon text-[#1C1917] tracking-wider drop-shadow-md">
            TRILHA DO RELEASE
          </h1>
          <p className="text-stone-700 max-w-xl mx-auto text-xs sm:text-sm md:text-base font-retro leading-relaxed">
            O Tabuleiro da Gestão Ágil! Role os dados, enfrente os imprevistos do <strong className="font-bold text-[#1C1917]">Relatório CHAOS</strong> e chegue ao Deploy Final!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 relative z-10">
          {/* Player Count Selection */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-cartoon text-[#1C1917] uppercase tracking-wider">
              <Users className="w-4 h-4 text-[#1C1917]" />
              Número de Jogadores na Partida (1 a 4):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              {[1, 2, 3, 4].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => handleCountChange(count)}
                  className={`py-2.5 sm:py-3 rounded-xl font-cartoon text-xs sm:text-sm md:text-base transition-all duration-150 border-3 border-[#1C1917] flex items-center justify-center gap-1.5 cursor-pointer ${
                    playerCount === count
                      ? 'bg-[#F59E0B] text-[#1C1917] shadow-[3px_3px_0px_0px_rgba(28,25,23,1)] scale-[1.02]'
                      : 'bg-[#FFF8E7] text-stone-600 shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] hover:bg-[#FAF5E4]'
                  }`}
                >
                  <span>{count}</span>
                  <span className="text-[11px] sm:text-xs uppercase opacity-80">{count === 1 ? 'Solo' : 'Jogadores'}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Player Customization Preview Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-cartoon text-[#1C1917] uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#1C1917]" />
                Identificação e Personalização dos Jogadores:
              </h3>
              <span className="text-[11px] font-retro text-stone-600">
                ★ Clique no ícone para escolher a cor e o avatar!
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {Array.from({ length: playerCount }).map((_, idx) => {
                const player = playersSetup[idx];
                const colorObj = VINTAGE_COLOR_OPTIONS.find((c) => c.id === player.colorId) || VINTAGE_COLOR_OPTIONS[0];

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#FFF8E7] border-3 border-[#1C1917] shadow-[3px_3px_0px_0px_rgba(28,25,23,1)] flex items-center gap-3 relative group"
                  >
                    {/* Clickable Avatar Button */}
                    <button
                      type="button"
                      onClick={() => setEditingPlayerIndex(idx)}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold border-3 border-[#1C1917] shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] ${colorObj.bgClass} text-white shrink-0 hover:scale-105 active:scale-95 transition-transform cursor-pointer relative`}
                      title="Clique para escolher a cor e o avatar"
                    >
                      <PlayerIcon icon={player.iconSymbol} className="w-6 h-6 stroke-[2.5]" />
                      <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-[#F59E0B] border border-[#1C1917] text-[#1C1917]">
                        <Paintbrush className="w-2.5 h-2.5" />
                      </span>
                    </button>

                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-stone-600 font-bold">Jogador {idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => setEditingPlayerIndex(idx)}
                          className={`font-cartoon text-xs hover:underline cursor-pointer ${colorObj.textClass}`}
                        >
                          {colorObj.name}
                        </button>
                      </div>
                      <input
                        type="text"
                        value={player.name}
                        onChange={(e) => handleNameChange(idx, e.target.value)}
                        placeholder={`Nome do Jogador ${idx + 1}`}
                        className={`w-full bg-[#FAF5E4] border-2 rounded-lg px-3 py-1.5 text-xs text-[#1C1917] font-retro focus:outline-none focus:ring-2 focus:ring-[#F59E0B] ${
                          !player.name.trim() ? 'border-[#DC2626]' : 'border-[#1C1917]'
                        }`}
                        maxLength={20}
                        required
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Game Rules Quick Info */}
          <div className="p-4 rounded-xl bg-[#FFF8E7] border-3 border-[#1C1917] shadow-[3px_3px_0px_0px_rgba(28,25,23,1)] text-stone-800 text-xs flex items-start gap-3">
            <Info className="w-5 h-5 text-[#1C1917] shrink-0 mt-0.5" />
            <div>
              <strong className="font-cartoon text-[#1C1917]">Como Jogar (Regras da Gestão Ágil):</strong> Role o dado D6 virtual para saltar pelas casas do tabuleiro. Ao cair em uma Casa de Evento (<strong className="font-bold text-[#DC2626]">?</strong>), você tirará uma carta do Relatório CHAOS (acelerações, recuos ou pausas na Sprint). Cada jogador possui cor e avatar exclusivos, e o primeiro a alcançar a Casa 40 realiza o <strong>DEPLOY FINAL</strong>!
            </div>
          </div>

          {/* Submit CTA Button */}
          <button
            ref={submitButtonRef}
            type="submit"
            disabled={isFormInvalid}
            className={`w-full cartoon-btn py-4 text-xl font-cartoon uppercase tracking-wider flex items-center justify-center gap-3 relative overflow-hidden transition-all ${
              isFormInvalid
                ? 'bg-[#D6D3D1] text-[#78716C] border-3 border-[#1C1917] shadow-none cursor-not-allowed pointer-events-none opacity-100'
                : 'cursor-pointer'
            }`}
          >
            {/* Background Light Beam Shimmer Animation */}
            {!isFormInvalid && (
              <span className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none z-0" />
            )}
            <Play className={`w-6 h-6 relative z-10 ${isFormInvalid ? 'fill-[#78716C] text-[#78716C]' : 'fill-[#1C1917] text-[#1C1917]'}`} />
            <span className="relative z-10">JOGAR</span>
          </button>
        </form>
      </div>

      {/* Floating Sticky Bottom CTA Button when main JOGAR button is scrolled off-screen */}
      <AnimatePresence>
        {!isSubmitVisible && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 24 }}
            className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[92vw] w-[320px] sm:w-[380px] pointer-events-auto"
          >
            <button
              type="button"
              disabled={isFormInvalid}
              onClick={() => {
                if (isFormInvalid) return;
                const formElement = submitButtonRef.current?.form;
                if (formElement) {
                  formElement.requestSubmit();
                }
              }}
              className={`w-full cartoon-btn py-3.5 sm:py-4 text-lg sm:text-xl font-cartoon uppercase tracking-wider flex items-center justify-center gap-3 relative overflow-hidden shadow-[6px_6px_0px_0px_rgba(28,25,23,1)] transition-all ${
                isFormInvalid
                  ? 'bg-[#D6D3D1] text-[#78716C] border-3 border-[#1C1917] shadow-none cursor-not-allowed pointer-events-none opacity-100'
                  : 'cursor-pointer'
              }`}
            >
              {!isFormInvalid && (
                <span className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none z-0" />
              )}
              <Play className={`w-5 h-5 sm:w-6 sm:h-6 relative z-10 ${isFormInvalid ? 'fill-[#78716C] text-[#78716C]' : 'fill-[#1C1917] text-[#1C1917]'}`} />
              <span className="relative z-10">JOGAR</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Player Customization Modal */}
      {editingPlayerIndex !== null && (
        <PlayerCustomizationModal
          isOpen={editingPlayerIndex !== null}
          onClose={() => setEditingPlayerIndex(null)}
          player={playersSetup[editingPlayerIndex]}
          otherPlayers={playersSetup.filter((_, i) => i !== editingPlayerIndex && i < playerCount)}
          onSave={handleSaveCustomization}
        />
      )}
    </div>
  );
};
