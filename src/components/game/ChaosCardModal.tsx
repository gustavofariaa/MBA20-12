"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";
import { PlayerIcon } from "@/components/common/PlayerIcon";
import {
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  Layers,
  Sparkles,
  Zap,
} from "lucide-react";
import { soundManager } from "@/utils/soundManager";

export const ChaosCardModal: React.FC = () => {
  const phase = useGameStore((state) => state.phase);
  const activeCard = useGameStore((state) => state.activeCard);
  const applyActiveCardEffect = useGameStore(
    (state) => state.applyActiveCardEffect,
  );
  const players = useGameStore((state) => state.players);
  const currentPlayerIndex = useGameStore((state) => state.currentPlayerIndex);

  const currentPlayer = players[currentPlayerIndex];

  const [drawnCardId, setDrawnCardId] = useState<number | null>(null);

  const isVisible = phase === "CARD_DRAW" && activeCard !== null;

  // Lock body scroll when ChaosCardModal is active
  React.useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const isDrawn = drawnCardId === activeCard.id;

  const isSuccess = activeCard.effectType === "ACCELERATION";
  const isSkipTurn = activeCard.effectType === "SKIP_TURN";

  const handleDrawCard = () => {
    if (isDrawn) return;
    soundManager.playCardFlipSound();
    setDrawnCardId(activeCard.id);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1917]/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
        <div className="flex flex-col items-center justify-center space-y-4 my-auto">
          {/* Header Hint Above Deck / Card */}
          <div className="text-center space-y-1">
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full ${currentPlayer?.bgClass ?? "bg-[#F59E0B]"} text-white border-2 border-[#1C1917] text-xs sm:text-sm font-cartoon shadow-[3px_3px_0px_0px_rgba(28,25,23,1)] uppercase tracking-wider`}
            >
              <PlayerIcon
                icon={currentPlayer?.avatarIcon ?? ""}
                className="w-3.5 h-3.5 stroke-[2.5] text-white"
              />
              <span>{currentPlayer?.name} parou na Casa de Evento</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-cartoon text-amber-300 tracking-wide drop-shadow">
              {isDrawn ? "Carta Revelada!" : "Deck do Relatório CHAOS"}
            </h3>
          </div>

          {/* Table Container with Playing Card Aspect Ratio */}
          <div className="relative w-[300px] xs:w-[320px] sm:w-[350px] md:w-[370px] h-[480px] sm:h-[530px] max-h-[85vh] [perspective:1200px]">
            {/* STATIC DECK STACK (Stays still on the table underneath at all times!) */}
            <div className="absolute inset-0 pointer-events-none z-0">
              <div className="absolute inset-0 rounded-3xl bg-[#1C1917] border-4 border-stone-800 rotate-[-7deg] translate-y-3.5 translate-x-[-8px] shadow-lg opacity-60" />
              <div className="absolute inset-0 rounded-3xl bg-[#F59E0B] border-4 border-[#1C1917] rotate-[5deg] translate-y-2 translate-x-[6px] shadow-lg opacity-80" />
              <div className="absolute inset-0 rounded-3xl bg-amber-800 border-4 border-[#1C1917] rotate-[-2deg] translate-y-1 translate-x-[-2px] shadow-xl opacity-90" />
            </div>

            {/* ONLY THE TOP CARD FLIPS & LIFTS OFF THE DECK! */}
            <motion.div
              animate={{
                rotateY: isDrawn ? 180 : 0,
                y: isDrawn ? -10 : 0,
                scale: isDrawn ? 1.03 : 1,
              }}
              transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
              className="relative z-10 w-full h-full rounded-3xl [transform-style:preserve-3d]"
            >
              {/* FACE 1: VERSO DA CARTA DO TOPO (Visível no monte antes de virar) */}
              <div
                onClick={handleDrawCard}
                className={`w-full h-full rounded-3xl p-6 bg-gradient-to-br from-[#1C1917] via-[#292524] to-[#1C1917] border-4 border-amber-400 text-amber-400 shadow-[10px_10px_0px_0px_rgba(0,0,0,0.6)] [backface-visibility:hidden] flex flex-col items-center justify-between text-center ${
                  isDrawn
                    ? "pointer-events-none"
                    : "cursor-pointer group hover:scale-[1.02] transition-transform"
                }`}
              >
                {/* Top Card Back Outer Frame */}
                <div className="flex items-center justify-between w-full text-xs font-cartoon tracking-widest text-amber-300 uppercase border-b-2 border-amber-400/20 pb-2">
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span>EVENTO CHAOS</span>
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                </div>

                <div className="my-auto flex flex-col items-center gap-3">
                  <div className="p-4 rounded-2xl bg-amber-400/10 border-2 border-amber-400/30 text-amber-400 group-hover:bg-amber-400/20 transition-colors">
                    <Layers className="w-14 h-14 animate-bounce text-amber-300" />
                  </div>
                  <div>
                    <span className="text-lg font-cartoon tracking-widest uppercase text-amber-300 block drop-shadow">
                      RELATÓRIO SPRINT
                    </span>
                    <span className="text-xs font-retro text-amber-400/60 tracking-wider uppercase">
                      ★ TOP SECRET ★
                    </span>
                  </div>
                </div>

                <div className="w-full pt-2 border-t-2 border-amber-400/20 text-center">
                  <span className="text-xs font-cartoon uppercase tracking-wider text-amber-300 bg-amber-400/10 px-4 py-1.5 rounded-full border border-amber-400/30 inline-flex items-center gap-1.5 group-hover:scale-105 transition-transform">
                    <Sparkles className="w-3.5 h-3.5" />
                    Toque para virar a carta
                  </span>
                </div>
              </div>

              {/* FACE 2: FRENTE DA CARTA DO TOPO (Revelada no giro de 180deg) */}
              <div
                className={`absolute inset-0 w-full h-full rounded-3xl p-5 sm:p-6 bg-[#FAF5E4] border-4 border-[#1C1917] shadow-[12px_12px_0px_0px_rgba(28,25,23,1)] text-[#1C1917] [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-between space-y-3 ${
                  !isDrawn ? "pointer-events-none" : ""
                }`}
              >
                {/* Card Face Header */}
                <div className="flex items-center justify-between border-b-3 border-[#1C1917] pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#F59E0B] border-2 border-[#1C1917]">
                      <PlayerIcon
                        icon={currentPlayer?.avatarIcon ?? ""}
                        className="w-3.5 h-3.5"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-cartoon tracking-wider text-stone-600 block">
                        Jogador da Vez
                      </span>
                      <span className="text-xs font-bold font-retro text-[#1C1917]">
                        {currentPlayer?.name}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`px-3 py-1 rounded-full text-[11px] font-cartoon uppercase tracking-wider border-2 border-[#1C1917] shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] ${
                      isSuccess
                        ? "bg-[#0D9488] text-white"
                        : isSkipTurn
                          ? "bg-[#F59E0B] text-[#1C1917]"
                          : "bg-[#DC2626] text-white"
                    }`}
                  >
                    {activeCard.category}
                  </div>
                </div>

                {/* Card Face Body Content */}
                <div className="space-y-2.5 my-auto">
                  <h3 className="text-xl sm:text-2xl font-cartoon text-[#1C1917] tracking-wide leading-tight">
                    {activeCard.title}
                  </h3>

                  <p className="text-stone-800 text-xs font-retro leading-relaxed bg-[#FFF8E7] p-3 rounded-xl border-2 border-[#1C1917] shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]">
                    {activeCard.description}
                  </p>

                  {/* CHAOS Metric Highlight Box */}
                  <div className="p-2.5 rounded-xl bg-[#FFF8E7] border-2 border-[#1C1917] shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] space-y-0.5">
                    <div className="flex items-center gap-1.5 text-stone-700 text-[10px] font-cartoon uppercase">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1C1917]" />
                      Relatório CHAOS:
                    </div>
                    <p className="text-[11px] text-stone-800 font-retro italic font-semibold leading-tight">
                      &quot;{activeCard.chaosMetric}&quot;
                    </p>
                  </div>

                  {/* Sprint Effect Banner */}
                  <div
                    className={`p-2.5 rounded-xl border-2 border-[#1C1917] shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] flex items-center justify-between ${
                      isSuccess
                        ? "bg-[#E6FFFA] text-[#0D9488]"
                        : isSkipTurn
                          ? "bg-[#FEF3C7] text-[#B45309]"
                          : "bg-[#FEF2F2] text-[#DC2626]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isSuccess ? (
                        <ArrowUpRight className="w-5 h-5 text-[#0D9488] shrink-0" />
                      ) : isSkipTurn ? (
                        <Clock className="w-5 h-5 text-[#B45309] shrink-0" />
                      ) : (
                        <ArrowDownRight className="w-5 h-5 text-[#DC2626] shrink-0" />
                      )}
                      <div>
                        <span className="text-[9px] font-cartoon uppercase tracking-wider block opacity-85">
                          Efeito na Sprint:
                        </span>
                        <span className="text-xs font-cartoon">
                          {isSuccess
                            ? `Avança +${activeCard.effectValue} casas imediatamente!`
                            : isSkipTurn
                              ? "Perde a vez no próximo turno!"
                              : `Recua ${Math.abs(activeCard.effectValue)} casa(s)!`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Button right on Card Face */}
                <button
                  type="button"
                  onClick={applyActiveCardEffect}
                  className="w-full cartoon-btn py-3 text-xs sm:text-sm font-cartoon uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer mt-1"
                >
                  <Zap className="w-4 h-4 text-[#1C1917]" />
                  APLICAR EFEITO & CONTINUAR!
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};
