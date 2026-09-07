'use client';

import React from 'react';
import { TileConfig } from '@/types/game';
import { TileCoordinate } from '@/data/boardConfig';
import { HelpCircle, Rocket, Flag } from 'lucide-react';

interface BoardTileProps {
  tile: TileConfig;
  coord: TileCoordinate;
  viewBoxWidth?: number;
  viewBoxHeight?: number;
}

export const BoardTile: React.FC<BoardTileProps> = ({
  tile,
  coord,
  viewBoxWidth = 1000,
  viewBoxHeight = 660,
}) => {
  // Map joyful, high-contrast tile badge styles
  const getColorGroupStyles = () => {
    if (tile.isDeploy) {
      return 'bg-[#F59E0B] text-[#1C1917] font-cartoon border-4 border-[#1C1917] shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] scale-110 ring-4 ring-[#FEF08A]';
    }
    if (tile.isStart) {
      return 'bg-[#10B981] text-white font-cartoon border-3 border-[#1C1917] shadow-[3px_3px_0px_0px_rgba(28,25,23,1)]';
    }
    if (tile.isEvent) {
      return 'bg-[#A855F7] text-white font-cartoon border-3 border-[#1C1917] shadow-[3px_3px_0px_0px_rgba(28,25,23,1)]';
    }

    return 'bg-[#FFFBEB] text-[#1C1917] font-cartoon border-3 border-[#1C1917] shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]';
  };

  return (
    <div
      style={{
        left: `${(coord.x / viewBoxWidth) * 100}%`,
        top: `${(coord.y / viewBoxHeight) * 100}%`,
      }}
      className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center justify-center pointer-events-auto"
    >
      {/* 1930s Cartoon Block Tile Badge */}
      <div
        className={`relative min-w-[34px] sm:min-w-[42px] md:min-w-[48px] h-7 sm:h-8 md:h-9 px-1.5 sm:px-2 rounded-lg sm:rounded-xl flex items-center justify-center ${getColorGroupStyles()}`}
      >
        {/* Label / Number in Luckiest Guy Cartoon Font */}
        <div className="flex items-center gap-0.5 sm:gap-1 font-cartoon text-[10px] sm:text-xs md:text-sm tracking-wide drop-shadow">
          {tile.isDeploy ? (
            <div className="flex items-center gap-0.5 sm:gap-1">
              <Rocket className="w-3 h-3 sm:w-4 sm:h-4 text-[#1C1917] animate-bounce" />
              <span>DEPLOY</span>
            </div>
          ) : tile.isStart ? (
            <div className="flex items-center gap-0.5 sm:gap-1">
              <Flag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
              <span>Início</span>
            </div>
          ) : (
            <span>{tile.number < 10 ? `0${tile.number}` : tile.number}</span>
          )}

          {tile.isEvent && !tile.isDeploy && (
            <HelpCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white stroke-[3] animate-pulse" />
          )}
        </div>
      </div>
    </div>
  );
};
