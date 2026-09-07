'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Player } from '@/types/game';
import { TileCoordinate } from '@/data/boardConfig';
import { PlayerIcon } from '@/components/common/PlayerIcon';
import { soundManager } from '@/utils/soundManager';

interface PawnProps {
  player: Player;
  coord: TileCoordinate;
  isCurrentTurn: boolean;
  offsetIndex: number;
  viewBoxWidth?: number;
  viewBoxHeight?: number;
}

export const Pawn: React.FC<PawnProps> = ({
  player,
  coord,
  isCurrentTurn,
  offsetIndex,
  viewBoxWidth = 1000,
  viewBoxHeight = 660,
}) => {
  // Play hop sound when pawn moves to new tile coordinates
  React.useEffect(() => {
    soundManager.playPawnHopSound();
  }, [coord.x, coord.y]);
  // Compute small offset positions inside tile for multi-player overlap
  const offsets = [
    { x: -10, y: -10 },
    { x: 10, y: -10 },
    { x: -10, y: 10 },
    { x: 10, y: 10 }
  ];
  const offset = offsets[offsetIndex % offsets.length];

  // Map coordinates to percentage inside board container
  const targetX = (coord.x / viewBoxWidth) * 100;
  const targetY = (coord.y / viewBoxHeight) * 100;

  return (
    /* Outer Div: Smooth linear track movement synced with 300ms step interval */
    <motion.div
      initial={{
        left: `${targetX}%`,
        top: `${targetY}%`,
        x: offset.x,
        y: offset.y,
        scale: isCurrentTurn ? 1.25 : 1.0
      }}
      animate={{
        left: `${targetX}%`,
        top: `${targetY}%`,
        x: offset.x,
        y: offset.y,
        scale: isCurrentTurn ? 1.25 : 1.0
      }}
      transition={{
        duration: 0.28,
        ease: 'easeInOut'
      }}
      className={`absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto ${
        isCurrentTurn ? 'z-[70]' : 'z-40 opacity-90'
      }`}
    >
      {/* Inner Div: Vertical 3D Hop Arc & Rubber-hose landing squish (Re-triggered per step) */}
      <motion.div
        key={`pawn-hop-${player.id}-${player.position}`}
        initial={{ y: 0, scaleY: 1, scaleX: 1 }}
        animate={{
          y: [0, -26, 0],
          scaleY: [1, 1.25, 0.8, 1],
          scaleX: [1, 0.8, 1.2, 1]
        }}
        transition={{
          duration: 0.28,
          times: [0, 0.45, 0.85, 1],
          ease: 'easeInOut'
        }}
        className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 sm:border-3 border-[#1C1917] shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] sm:shadow-[3px_3px_0px_0px_rgba(28,25,23,1)] ${
          player.bgClass
        } ${
          isCurrentTurn
            ? 'ring-2 sm:ring-4 ring-[#F59E0B] shadow-[3px_3px_0px_0px_rgba(28,25,23,1)] sm:shadow-[5px_5px_0px_0px_rgba(28,25,23,1)]'
            : ''
        }`}
        title={`${player.name} (${player.color}) - Casa ${player.position}`}
      >
        <PlayerIcon icon={player.avatarIcon} className="w-3 h-3 sm:w-4 sm:h-4 text-white stroke-[2.5]" />
        {player.isPenalized && (
          <span className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 bg-[#DC2626] border-1.5 sm:border-2 border-[#1C1917] text-white rounded-full text-[9px] sm:text-[10px] flex items-center justify-center font-cartoon shadow-sm z-[80]">
            !
          </span>
        )}
      </motion.div>
    </motion.div>
  );
};
