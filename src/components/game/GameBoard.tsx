'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  BOARD_TILES,
  TILE_PATH_COORDINATES_DESKTOP,
  TILE_PATH_COORDINATES_MOBILE,
  TILE_PATH_COORDINATES_TABLET,
  TileCoordinate,
} from '@/data/boardConfig';
import { BoardTile } from './BoardTile';
import { Pawn } from './Pawn';
import { Player } from '@/types/game';
import { useGameStore } from '@/store/useGameStore';

interface GameBoardProps {
  players: Player[];
  currentPlayerId: number;
}

export const GameBoard: React.FC<GameBoardProps> = ({ players, currentPlayerId }) => {
  const [screenMode, setScreenMode] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setScreenMode('mobile');
      } else if (w < 1024) {
        setScreenMode('tablet');
      } else {
        setScreenMode('desktop');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const tileCoordinates: TileCoordinate[] =
    screenMode === 'mobile'
      ? TILE_PATH_COORDINATES_MOBILE
      : screenMode === 'tablet'
      ? TILE_PATH_COORDINATES_TABLET
      : TILE_PATH_COORDINATES_DESKTOP;

  const viewBoxWidth = screenMode === 'mobile' ? 400 : screenMode === 'tablet' ? 700 : 1000;
  const viewBoxHeight = screenMode === 'mobile' ? 1000 : screenMode === 'tablet' ? 750 : 660;

  const activePlayer = players.find((p) => p.id === currentPlayerId);
  const activePosition = activePlayer?.position || 1;

  const phase = useGameStore((state) => state.phase);
  const boardWrapperRef = useRef<HTMLDivElement>(null);

  // Smooth scroll page window camera to center the ACTIVE PAWN specifically on screen
  useEffect(() => {
    if (phase === 'PAWN_MOVING' && boardWrapperRef.current) {
      const boardRect = boardWrapperRef.current.getBoundingClientRect();
      const tileIndex = Math.max(0, Math.min(39, activePosition - 1));
      const coord = tileCoordinates[tileIndex];

      const pawnYWithinBoard = (coord.y / viewBoxHeight) * boardRect.height;
      const pawnAbsoluteY = window.scrollY + boardRect.top + pawnYWithinBoard;
      const targetScrollY = pawnAbsoluteY - window.innerHeight / 2;

      window.scrollTo({
        top: Math.max(0, targetScrollY),
        behavior: 'smooth',
      });
    }
  }, [activePosition, phase, tileCoordinates, viewBoxHeight]);

  // Auto-scroll inside track container for mobile portrait if needed
  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const tileIndex = Math.max(0, Math.min(39, activePosition - 1));
    const coord = tileCoordinates[tileIndex];

    if (screenMode === 'mobile') {
      const boardHeight = container.scrollHeight;
      const targetY = (coord.y / viewBoxHeight) * boardHeight;
      const scrollTop = targetY - container.clientHeight / 2;
      container.scrollTo({ top: Math.max(0, scrollTop), behavior: 'smooth' });
    }
  }, [activePosition, currentPlayerId, screenMode, tileCoordinates, viewBoxHeight]);

  // Generate SVG path string connecting coordinates for Mobile (10 tiers), Tablet (6 tiers) or Desktop (4 tiers)
  const generateRibbonPath = () => {
    if (tileCoordinates.length === 0) return '';

    let d = `M ${tileCoordinates[0].x} ${tileCoordinates[0].y}`;
    for (let i = 0; i < tileCoordinates.length - 1; i++) {
      const p0 = tileCoordinates[i];
      const p1 = tileCoordinates[i + 1];

      if (Math.abs(p0.y - p1.y) < 15) {
        d += ` L ${p1.x} ${p1.y}`;
      } else {
        const midPoint = viewBoxWidth / 2;
        const offset = screenMode === 'mobile' ? 30 : screenMode === 'tablet' ? 35 : 40;
        const outerX = p0.x < midPoint ? Math.min(p0.x, p1.x) - offset : Math.max(p0.x, p1.x) + offset;
        d += ` C ${outerX} ${p0.y}, ${outerX} ${p1.y}, ${p1.x} ${p1.y}`;
      }
    }
    return d;
  };

  const getSegmentColor = (colorGroup: string) => {
    switch (colorGroup) {
      case 'cyan':
        return '#7DD3FC';
      case 'orange':
        return '#FDBA74';
      case 'pink':
        return '#F472B6';
      case 'parchment':
      default:
        return '#FEF08A';
    }
  };

  const fullPathD = generateRibbonPath();
  const isMobile = screenMode === 'mobile';
  const isTablet = screenMode === 'tablet';

  return (
    <div ref={boardWrapperRef} className="w-full bg-[#FAF5E4] rounded-2xl border-4 border-[#1C1917] p-2.5 sm:p-4 md:p-6 shadow-[8px_8px_0px_0px_rgba(28,25,23,1)] relative overflow-hidden text-[#1C1917]">
      {/* Board Header / Legend Info */}
      <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-4 mb-3 md:mb-4 px-1 sm:px-2 text-[10px] sm:text-xs font-retro font-bold text-stone-800">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#10B981] border border-[#1C1917]" />
          Início (#01)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#A855F7] border border-[#1C1917]" />
          ? Evento CHAOS
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#F59E0B] border border-[#1C1917]" />
          #40 Deploy
        </span>
      </div>

      {/* Serpentine Ribbon Track Wrapper - Adaptive Aspect Ratio */}
      <div
        ref={scrollContainerRef}
        className="w-full overflow-hidden rounded-xl select-none"
      >
        <div
          className={`relative w-full bg-[#FFF8E7] rounded-xl border-3 border-[#1C1917] shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] overflow-hidden p-2 ${
            isMobile
              ? 'aspect-[400/1050]'
              : isTablet
              ? 'aspect-[700/750]'
              : 'aspect-[1000/660]'
          }`}
        >
          {/* Layer 0: SVG Ribbon Road Path (z-0) */}
          <svg
            viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
          >
            {/* Outer Track Heavy Ink Outline */}
            <path
              d={fullPathD}
              fill="none"
              stroke="#1C1917"
              strokeWidth={isMobile ? "44" : isTablet ? "50" : "56"}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Track Ribbon Base Fill */}
            <path
              d={fullPathD}
              fill="none"
              stroke="#FEF3C7"
              strokeWidth={isMobile ? "36" : isTablet ? "42" : "48"}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Individual Segment Ribbon Fills Matching Joyful Vintage Palette */}
            {tileCoordinates.map((coord, idx) => {
              if (idx === tileCoordinates.length - 1) return null;
              const p0 = coord;
              const p1 = tileCoordinates[idx + 1];

              let segD = '';
              if (Math.abs(p0.y - p1.y) < 15) {
                segD = `M ${p0.x} ${p0.y} L ${p1.x} ${p1.y}`;
              } else {
                const outerX = isMobile
                  ? p0.x < 200 ? Math.min(p0.x, p1.x) - 35 : Math.max(p0.x, p1.x) + 35
                  : isTablet
                  ? p0.x < 350 ? Math.min(p0.x, p1.x) - 38 : Math.max(p0.x, p1.x) + 38
                  : p0.x < 500 ? Math.min(p0.x, p1.x) - 40 : Math.max(p0.x, p1.x) + 40;
                segD = `M ${p0.x} ${p0.y} C ${outerX} ${p0.y}, ${outerX} ${p1.y}, ${p1.x} ${p1.y}`;
              }

              return (
                <path
                  key={`seg-${idx}`}
                  d={segD}
                  fill="none"
                  stroke={getSegmentColor(coord.colorGroup)}
                  strokeWidth={isMobile ? "30" : isTablet ? "35" : "40"}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.95"
                />
              );
            })}

            {/* Inner Dashed Ink Lane Line */}
            <path
              d={fullPathD}
              fill="none"
              stroke="#1C1917"
              strokeWidth="2.5"
              strokeDasharray="8 10"
              opacity="0.35"
            />
          </svg>

          {/* Layer 10: Overlaid Tile Badges (z-10) */}
          <div className="relative w-full h-full z-10 pointer-events-none">
            {BOARD_TILES.map((tile, idx) => {
              const coord = tileCoordinates[idx];

              return (
                <BoardTile
                  key={tile.number}
                  tile={tile}
                  coord={coord}
                  viewBoxWidth={viewBoxWidth}
                  viewBoxHeight={viewBoxHeight}
                />
              );
            })}
          </div>

          {/* Layer 50: Absolute Pawns Layer ABOVE EVERYTHING (z-50) */}
          <div className="absolute inset-0 w-full h-full z-50 pointer-events-none">
            {players.map((player) => {
              const tileIndex = Math.max(0, Math.min(39, player.position - 1));
              const coord = tileCoordinates[tileIndex];
              const playersOnSameTile = players.filter((p) => p.position === player.position);
              const offsetIndex = playersOnSameTile.findIndex((p) => p.id === player.id);

              return (
                <Pawn
                  key={player.id}
                  player={player}
                  coord={coord}
                  isCurrentTurn={player.id === currentPlayerId}
                  offsetIndex={offsetIndex >= 0 ? offsetIndex : 0}
                  viewBoxWidth={viewBoxWidth}
                  viewBoxHeight={viewBoxHeight}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};


