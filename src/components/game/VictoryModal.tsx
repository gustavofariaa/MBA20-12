"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";
import confetti from "canvas-confetti";
import { Trophy, RefreshCw, PartyPopper } from "lucide-react";
import { soundManager } from "@/utils/soundManager";

export const VictoryModal: React.FC = () => {
  const phase = useGameStore((state) => state.phase);
  const winner = useGameStore((state) => state.winner);
  const resetGame = useGameStore((state) => state.resetGame);

  const isVisible = phase === "GAME_OVER" && winner !== null;

  useEffect(() => {
    if (phase === "GAME_OVER" && winner) {
      soundManager.playVictoryFanfareSound();
      // Fire confetti burst
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.6 },
      });
    }
  }, [phase, winner]);

  // Lock body scroll when VictoryModal is active
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1C1917]/80 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 30 }}
          className="relative w-full max-w-[92vw] sm:max-w-lg rounded-2xl p-5 sm:p-8 bg-[#FAF5E4] border-4 border-[#1C1917] shadow-[10px_10px_0px_0px_rgba(28,25,23,1)] text-center text-[#1C1917] overflow-hidden my-auto"
        >
          {/* Trophy Header Icon */}
          <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-[#F59E0B] border-4 border-[#1C1917] shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] p-0.5 flex items-center justify-center text-[#1C1917] relative z-10">
            <Trophy className="w-10 h-10 animate-bounce text-[#1C1917] stroke-[2.2]" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#FFF8E7] border-2 border-[#1C1917] shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] text-[#1C1917] text-xs font-cartoon uppercase tracking-wider mb-4 relative z-10">
            <PartyPopper className="w-4 h-4 fill-[#1C1917]" />
            THAT&apos;S ALL FOLKS!
          </div>

          <h2 className="text-4xl md:text-5xl font-cartoon text-[#1C1917] mb-2 tracking-wider drop-shadow relative z-10">
            DEPLOY REALIZADO!
          </h2>

          <p className="text-stone-800 text-sm font-retro mb-6 relative z-10">
            Parabéns{" "}
            <strong className={`font-cartoon text-lg ${winner.textClass}`}>
              {winner.name}
            </strong>
            ! Você superou os imprevistos do Relatório CHAOS e lançou o software
            em Produção com Sucesso!
          </p>

          <div className="p-4 rounded-xl bg-[#FFF8E7] border-3 border-[#1C1917] shadow-[3px_3px_0px_0px_rgba(28,25,23,1)] mb-8 flex items-center justify-center gap-3 relative z-10">
            <Trophy className="w-6 h-6 text-[#F59E0B]" />
            <span className="text-sm font-cartoon text-[#1C1917]">
              CHEGOU À CASA 40 (DEPLOY FINAL)!
            </span>
          </div>

          <button
            type="button"
            onClick={resetGame}
            className="w-full cartoon-btn py-4 text-lg font-cartoon uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer relative z-10"
          >
            <RefreshCw className="w-5 h-5" />
            JOGAR NOVAMENTE!
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
