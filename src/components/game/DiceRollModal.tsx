"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";
import { PlayerIcon } from "@/components/common/PlayerIcon";
import { Footprints, Clock, Sparkles } from "lucide-react";

import { soundManager } from "@/utils/soundManager";

export const DiceRollModal: React.FC = () => {
  const phase = useGameStore((state) => state.phase);
  const isDiceRolling = useGameStore((state) => state.isDiceRolling);
  const diceResult = useGameStore((state) => state.diceResult);
  const players = useGameStore((state) => state.players);
  const currentPlayerIndex = useGameStore((state) => state.currentPlayerIndex);

  const currentPlayer = players[currentPlayerIndex];
  const isPenalized = currentPlayer?.isPenalized;

  const pendingDiceRoll = useGameStore((state) => state.pendingDiceRoll);

  const [tickerValue, setTickerValue] = useState<number>(1);

  // Play dice land sound when result settles
  useEffect(() => {
    if (phase === "DICE_SETTLED" && diceResult) {
      soundManager.playDiceLandSound();
    }
  }, [phase, diceResult]);

  // Deceleration suspense face sequence (Fast -> Medium -> Slow Tease -> Final Target)
  useEffect(() => {
    if (!isDiceRolling || isPenalized || !pendingDiceRoll || !currentPlayer) return;

    const targetRoll = pendingDiceRoll;
    const distanceToFinish = 40 - currentPlayer.position;
    const neededRoll = distanceToFinish <= 6 && distanceToFinish >= 1 ? distanceToFinish : null;

    // Determine tease face for second-to-last dramatic slow tick
    let teaseFace: number;
    if (neededRoll) {
      if (targetRoll === neededRoll) {
        // Player will WIN! Tease a non-winning number first (e.g., 5 or 2) to create initial heartbreak before victory!
        const nonWinningOptions = [1, 2, 3, 4, 5, 6].filter((n) => n !== neededRoll);
        teaseFace = nonWinningOptions[Math.floor(Math.random() * nonWinningOptions.length)];
      } else {
        // Player won't win this turn. Tease the EXACT winning number (neededRoll) to build excitement before missing!
        teaseFace = neededRoll;
      }
    } else {
      // Normal gameplay: pick a face different from targetRoll
      const otherOptions = [1, 2, 3, 4, 5, 6].filter((n) => n !== targetRoll);
      teaseFace = otherOptions[Math.floor(Math.random() * otherOptions.length)];
    }

    const getRandomFace = (exclude?: number) => {
      const choices = [1, 2, 3, 4, 5, 6].filter((n) => n !== exclude);
      return choices[Math.floor(Math.random() * choices.length)];
    };

    // Scheduled sequence timings (in ms)
    const steps: { delay: number; value: number }[] = [
      // Fast Phase (60-70ms)
      { delay: 65, value: getRandomFace() },
      { delay: 130, value: getRandomFace() },
      { delay: 195, value: getRandomFace() },
      { delay: 260, value: getRandomFace() },
      { delay: 330, value: getRandomFace() },
      { delay: 400, value: getRandomFace() },

      // Medium Phase (130-170ms)
      { delay: 530, value: getRandomFace() },
      { delay: 670, value: getRandomFace() },
      { delay: 830, value: getRandomFace() },

      // Slow Suspense Phase (220-430ms)
      { delay: 1050, value: getRandomFace(targetRoll) },
      { delay: 1350, value: teaseFace },    // Dramatic Tease Face (held for ~430ms!)
      { delay: 1780, value: targetRoll }   // Final Landed Target Face!
    ];

    const timeouts: NodeJS.Timeout[] = [];
    steps.forEach((step, idx) => {
      const t = setTimeout(() => {
        setTickerValue(step.value);
        if (idx === steps.length - 1) {
          soundManager.playDiceLandSound();
        } else {
          soundManager.playDiceRollingSound();
        }
      }, step.delay);
      timeouts.push(t);
    });

    return () => {
      timeouts.forEach((t) => clearTimeout(t));
    };
  }, [isDiceRolling, isPenalized, pendingDiceRoll, currentPlayer]);

  // Modal is visible during rolling OR when dice result has settled
  const isVisible = isDiceRolling || phase === "DICE_SETTLED";

  // Lock body scroll when modal is active
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isVisible]);

  if (!currentPlayer || !isVisible || isPenalized) return null;

  // Dice face dot configurations for D6
  const getDiceDots = (val: number) => {
    switch (val) {
      case 1:
        return [4]; // center
      case 2:
        return [0, 8]; // top-left, bottom-right
      case 3:
        return [0, 4, 8]; // top-left, center, bottom-right
      case 4:
        return [0, 2, 6, 8]; // corners
      case 5:
        return [0, 2, 4, 6, 8]; // corners + center
      case 6:
        return [0, 2, 3, 5, 6, 8]; // 2 columns of 3
      default:
        return [];
    }
  };

  const activeDots = isDiceRolling
    ? getDiceDots(tickerValue)
    : diceResult
    ? getDiceDots(diceResult)
    : [];

  return (
    <AnimatePresence>
      <motion.div
        key="dice-roll-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1C1917]/80 backdrop-blur-sm"
      >
        <motion.div
          key="dice-roll-modal"
          initial={{ scale: 0.7, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: -15 }}
          transition={{ type: "spring", stiffness: 380, damping: 24 }}
          className="relative bg-[#FAF5E4] border-4 border-[#1C1917] rounded-3xl shadow-[10px_10px_0px_0px_rgba(28,25,23,1)] p-6 sm:p-8 max-w-[92vw] sm:max-w-md w-full text-center space-y-5 pointer-events-auto overflow-hidden"
        >
          {/* Top Badge: Player Turn Identification */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#F59E0B] border-2 border-[#1C1917] shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] text-[#1C1917] text-xs sm:text-sm font-cartoon uppercase tracking-wider">
            <Sparkles className="w-4 h-4 fill-[#1C1917]" />
            <span>Rolagem de Dado</span>
          </div>

          {/* Active Player Info Header */}
          <div className="flex items-center justify-center gap-3 bg-[#FFF8E7] p-3 rounded-2xl border-2 border-[#1C1917] shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]">
            <div
              className={`w-10 h-10 rounded-xl border-2 border-[#1C1917] ${currentPlayer.bgClass} text-white flex items-center justify-center shrink-0`}
            >
              <PlayerIcon
                icon={currentPlayer.avatarIcon}
                className="w-5 h-5 stroke-[2.5]"
              />
            </div>
            <div className="text-left">
              <span className="text-[10px] font-cartoon uppercase text-stone-600 block">
                Vez de Jogar
              </span>
              <span className="text-base sm:text-lg font-cartoon text-[#1C1917]">
                {currentPlayer.name}{" "}
                <span className="text-xs font-retro text-stone-600">
                  (Casa #{currentPlayer.position})
                </span>
              </span>
            </div>
          </div>

          {/* 3D Interactive D6 Dice Container */}
          <div className="py-3 flex flex-col items-center justify-center space-y-4 [perspective:1000px]">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
              <motion.div
                key={isDiceRolling ? `dice-ticker-${tickerValue}` : 'dice-landed'}
                animate={
                  isDiceRolling && !isPenalized
                    ? { scale: [1, 1.08, 1], rotate: [0, -2, 2, 0] }
                    : diceResult
                    ? { scale: [1.2, 1] }
                    : { scale: 1 }
                }
                transition={
                  isDiceRolling && !isPenalized
                    ? { duration: 0.15, ease: "easeOut" }
                    : diceResult
                    ? { type: "spring", stiffness: 400, damping: 20 }
                    : { duration: 0 }
                }
                className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-[#FFF8E7] border-4 border-[#1C1917] shadow-[6px_6px_0px_0px_rgba(28,25,23,1)] flex items-center justify-center relative p-2 ${
                  isPenalized ? "bg-[#FEF2F2] border-[#DC2626]" : ""
                }`}
              >
                {isPenalized ? (
                  <div className="flex flex-col items-center justify-center text-[#DC2626] space-y-1">
                    <Clock className="w-10 h-10 animate-pulse" />
                    <span className="text-xs font-cartoon uppercase tracking-tight">
                      Pausa
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-1.5 gap-1.5">
                    {Array.from({ length: 9 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-center"
                      >
                        {activeDots.includes(idx) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500 }}
                            className="w-4 h-4 rounded-full bg-[#1C1917] shadow-sm"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Status Message / Result Highlight */}
            {isDiceRolling ? (
              <div className="space-y-1">
                <p className="text-sm sm:text-base font-cartoon text-[#1C1917] animate-pulse">
                  {isPenalized
                    ? "Cumpriu penalidade..."
                    : "Rolando o dado da sprint..."}
                </p>
              </div>
            ) : diceResult ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className="space-y-2"
              >
                <div className="text-3xl sm:text-4xl font-cartoon text-[#0D9488] tracking-wider drop-shadow-sm">
                  +{diceResult} Casa(s)!
                </div>
                <div className="inline-flex items-center gap-2 text-sm font-cartoon text-stone-700 bg-[#FFF8E7] px-3 py-1 rounded-xl border border-[#1C1917] shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]">
                  <Footprints className="w-4 h-4 text-[#0D9488] animate-bounce" />
                  <span>
                    {currentPlayer.name} avança +{diceResult} casa(s) no
                    tabuleiro!
                  </span>
                </div>
              </motion.div>
            ) : null}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
