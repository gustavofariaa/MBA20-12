'use client';

import React from 'react';
import { useGameStore } from '@/store/useGameStore';
import { LobbyForm } from '@/components/game/LobbyForm';
import { GameBoard } from '@/components/game/GameBoard';
import { HUD } from '@/components/game/HUD';
import { DiceRollModal } from '@/components/game/DiceRollModal';
import { ChaosCardModal } from '@/components/game/ChaosCardModal';
import { VictoryModal } from '@/components/game/VictoryModal';

export default function Home() {
  const phase = useGameStore((state) => state.phase);
  const players = useGameStore((state) => state.players);
  const currentPlayerIndex = useGameStore((state) => state.currentPlayerIndex);

  const currentPlayer = players[currentPlayerIndex];

  if (phase === 'LOBBY') {
    return (
      <main className="min-h-screen bg-[#FFF8E7] flex items-center justify-center p-3 sm:p-4 md:p-8 relative overflow-x-hidden">
        <LobbyForm />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFF8E7] text-[#1C1917] p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col space-y-4 md:space-y-6 max-w-6xl mx-auto relative overflow-x-hidden font-retro">
      {/* Top HUD Card (Title, Leaderboard, Active Player & Rolar Dado Button) */}
      <HUD />

      {/* Main Game Board */}
      <GameBoard players={players} currentPlayerId={currentPlayer?.id} />

      {/* Overlays */}
      <DiceRollModal />
      <ChaosCardModal />
      <VictoryModal />
    </main>
  );
}

