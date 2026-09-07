"use client";

import React, { useState } from "react";
import { useGameStore } from "@/store/useGameStore";
import { PlayerIcon } from "@/components/common/PlayerIcon";
import { RefreshCw, AlertCircle, Sparkles, Dices, SkipForward, Volume2, VolumeX } from "lucide-react";
import { ResetConfirmModal } from "./ResetConfirmModal";
import { soundManager } from "@/utils/soundManager";

export const HUD: React.FC = () => {
  const phase = useGameStore((state) => state.phase);
  const players = useGameStore((state) => state.players);
  const currentPlayerIndex = useGameStore((state) => state.currentPlayerIndex);
  const isDiceRolling = useGameStore((state) => state.isDiceRolling);
  const rollDice = useGameStore((state) => state.rollDice);
  const resetGame = useGameStore((state) => state.resetGame);

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(() => soundManager.isMuted());

  const toggleSound = () => {
    const nextMute = soundManager.toggleMute();
    setIsMuted(nextMute);
  };

  const currentPlayer = players[currentPlayerIndex];
  const isButtonDisabled = phase !== "DICE_ROLL" || isDiceRolling;
  const isPenalized = currentPlayer?.isPenalized;

  const hudCardRef = React.useRef<HTMLDivElement>(null);

  // Smooth scroll page window camera to top of page when a new player turn starts
  React.useEffect(() => {
    if (phase === "DICE_ROLL") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPlayerIndex, phase]);

  return (
    <div ref={hudCardRef} className="w-full shrink-0">
      {/* Top Main Status Bar - Fixed Layout Stability */}
      <div className="bg-[#FAF5E4] border-4 border-[#1C1917] rounded-2xl p-3 sm:p-4 shadow-[6px_6px_0px_0px_rgba(28,25,23,1)] flex flex-col lg:flex-row items-center justify-between gap-3 sm:gap-4 text-[#1C1917] min-h-[72px]">
        {/* LEFT: Game Title Badge with Integrated Discrete Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="p-2 rounded-xl bg-[#F59E0B] border-2 border-[#1C1917] text-[#1C1917] shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] font-cartoon shrink-0">
            <Sparkles className="w-4 h-4 text-[#1C1917] fill-[#1C1917]" />
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <div>
              <h1 className="text-sm sm:text-base font-cartoon text-[#1C1917] tracking-wider uppercase leading-tight">
                TRILHA DO RELEASE
              </h1>
              <span className="text-[10px] sm:text-xs font-retro text-stone-600 block leading-tight">
                Edição Gestão Ágil ★ Sprint & Deploy
              </span>
            </div>

            {/* Discrete Controls: Audio Mute & Restart */}
            <div className="flex items-center gap-1.5 ml-1">
              <button
                type="button"
                onClick={toggleSound}
                className={`p-1.5 rounded-lg border-2 border-[#1C1917] shadow-[1.5px_1.5px_0px_0px_rgba(28,25,23,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer shrink-0 ${
                  isMuted
                    ? "bg-stone-300 text-stone-600"
                    : "bg-[#FFF8E7] hover:bg-amber-100 text-[#1C1917]"
                }`}
                title={isMuted ? "Ativar Efeitos Sonoros" : "Mutar Efeitos Sonoros"}
                aria-label={isMuted ? "Ativar Som" : "Mutar Som"}
              >
                {isMuted ? (
                  <VolumeX className="w-3.5 h-3.5 text-stone-600" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-[#1C1917]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsResetModalOpen(true)}
                className="p-1.5 rounded-lg bg-[#FFF8E7] hover:bg-red-100 text-stone-600 hover:text-[#DC2626] border-2 border-[#1C1917] shadow-[1.5px_1.5px_0px_0px_rgba(28,25,23,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer shrink-0"
                title="Reiniciar Partida"
                aria-label="Reiniciar Partida"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* CENTER: Player Chips Leaderboard (Max 2x2 Grid with explicit Min/Max Widths) */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 w-full lg:w-auto min-w-[268px] sm:min-w-[300px] max-w-[310px] sm:max-w-[350px]">
          {players.map((p, idx) => {
            const isActive = idx === currentPlayerIndex;
            return (
              <div
                key={p.id}
                className={`px-2 sm:px-2.5 h-9 sm:h-10 rounded-xl border-2 border-[#1C1917] text-[11px] sm:text-xs font-cartoon flex items-center justify-between gap-1 transition-all shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] min-w-[130px] max-w-[150px] sm:min-w-[145px] sm:max-w-[170px] w-full ${
                  isActive
                    ? `${p.bgClass} text-white ring-2 ring-[#F59E0B] ring-offset-1 ring-offset-[#FAF5E4]`
                    : "bg-[#FFF8E7] text-[#1C1917]"
                }`}
                title={`${p.name} - Casa ${p.position}`}
              >
                <div className="flex items-center gap-1 min-w-0 flex-1">
                  <PlayerIcon
                    icon={p.avatarIcon}
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2] shrink-0"
                  />
                  <span className="truncate block font-cartoon text-[10px] sm:text-xs leading-none">
                    {p.name}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="bg-[#1C1917] px-1 py-0.5 rounded text-[9px] sm:text-[10px] text-white min-w-[22px] sm:min-w-[24px] text-center shrink-0">
                    #{p.position}
                  </span>
                  {p.isPenalized && (
                    <span title="Penalizado neste turno" className="shrink-0">
                      <AlertCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#DC2626] animate-pulse" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT: ROLAR DADO ACTION BUTTON */}
        <div className="flex items-center gap-2.5 w-full lg:w-auto justify-center lg:justify-end shrink-0">
          <button
            type="button"
            onClick={rollDice}
            disabled={isButtonDisabled}
            className={`relative overflow-hidden z-10 h-11 w-[150px] sm:w-[170px] rounded-xl font-cartoon text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all duration-150 shrink-0 ${
              isButtonDisabled
                ? "bg-[#D6D3D1] text-[#78716C] border-3 border-[#1C1917] shadow-none cursor-not-allowed opacity-100"
                : isPenalized
                  ? "bg-[#DC2626] text-white border-3 border-[#1C1917] shadow-[3px_3px_0px_0px_rgba(28,25,23,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                  : "bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#F59E0B] text-[#1C1917] border-3 border-[#1C1917] shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] hover:scale-[1.04] active:scale-95"
            }`}
          >
            {/* Background Light Beam Shimmer Animation when Active */}
            {!isButtonDisabled && !isPenalized && (
              <span className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none z-0" />
            )}

            {isPenalized ? (
              <>
                <SkipForward className="w-4 h-4 shrink-0 relative z-10" />
                <span className="truncate relative z-10">{isDiceRolling ? "PASSANDO..." : "PASSAR VEZ"}</span>
              </>
            ) : (
              <>
                <Dices
                  className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 relative z-10 ${
                    isButtonDisabled ? "text-[#78716C]" : "text-[#1C1917]"
                  } ${isDiceRolling ? "animate-spin" : ""}`}
                />
                <span className="truncate relative z-10">{isDiceRolling ? "ROLANDO..." : "ROLAR DADO"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Confirmation Modal before Resetting Game */}
      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={() => {
          setIsResetModalOpen(false);
          resetGame();
        }}
      />
    </div>
  );
};
