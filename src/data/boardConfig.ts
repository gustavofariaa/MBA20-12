import { TileConfig } from '@/types/game';

// Strategic & balanced distribution of 15 event tiles across the 40 board tiles
export const EVENT_TILE_NUMBERS = [3, 6, 8, 11, 14, 17, 20, 22, 25, 28, 30, 33, 35, 37, 39];

export const BOARD_TILES: TileConfig[] = Array.from({ length: 40 }, (_, i) => {
  const tileNum = i + 1;
  return {
    number: tileNum,
    isStart: tileNum === 1,
    isDeploy: tileNum === 40,
    isEvent: EVENT_TILE_NUMBERS.includes(tileNum),
    label: tileNum === 1 ? 'Início' : tileNum === 40 ? 'DEPLOY' : undefined
  };
});

export interface TileCoordinate {
  x: number;
  y: number;
  colorGroup: 'parchment' | 'cyan' | 'orange' | 'pink';
}

/**
 * Desktop 4-tier Serpentine Track Coordinates (1000 x 660 viewBox)
 * 4 rows x 10 tiles = 40 tiles (3 S-curves / voltas)
 */
export const TILE_PATH_COORDINATES_DESKTOP: TileCoordinate[] = [
  // TIER 1 (Bottom Row, Y=570): Right -> Left (Tiles 1-10)
  { x: 910, y: 570, colorGroup: 'parchment' },  // 1 (Início)
  { x: 820, y: 570, colorGroup: 'parchment' },  // 2
  { x: 730, y: 570, colorGroup: 'cyan' },       // 3 (Evento)
  { x: 640, y: 570, colorGroup: 'cyan' },       // 4
  { x: 550, y: 570, colorGroup: 'orange' },     // 5
  { x: 460, y: 570, colorGroup: 'orange' },     // 6 (Evento)
  { x: 370, y: 570, colorGroup: 'pink' },       // 7
  { x: 280, y: 570, colorGroup: 'pink' },       // 8 (Evento)
  { x: 190, y: 570, colorGroup: 'parchment' },  // 9
  { x: 100, y: 570, colorGroup: 'parchment' },  // 10

  // LEFT TURN 1 (Tiles 11-12): Curve up from Y=570 to Y=410
  { x: 50,  y: 490, colorGroup: 'cyan' },       // 11 (Evento)
  { x: 100, y: 410, colorGroup: 'cyan' },       // 12

  // TIER 2 (Lower-Middle Row, Y=410): Left -> Right (Tiles 13-20)
  { x: 200, y: 410, colorGroup: 'orange' },     // 13
  { x: 300, y: 410, colorGroup: 'orange' },     // 14 (Evento)
  { x: 400, y: 410, colorGroup: 'pink' },       // 15
  { x: 500, y: 410, colorGroup: 'pink' },       // 16 (Evento)
  { x: 600, y: 410, colorGroup: 'parchment' },  // 17
  { x: 700, y: 410, colorGroup: 'parchment' },  // 18
  { x: 800, y: 410, colorGroup: 'cyan' },       // 19 (Evento)
  { x: 900, y: 410, colorGroup: 'cyan' },       // 20

  // RIGHT TURN 2 (Tiles 21-22): Curve up from Y=410 to Y=250
  { x: 950, y: 330, colorGroup: 'orange' },     // 21 (Evento)
  { x: 900, y: 250, colorGroup: 'orange' },     // 22

  // TIER 3 (Upper-Middle Row, Y=250): Right -> Left (Tiles 23-30)
  { x: 800, y: 250, colorGroup: 'pink' },       // 23
  { x: 700, y: 250, colorGroup: 'pink' },       // 24 (Evento)
  { x: 600, y: 250, colorGroup: 'parchment' },  // 25
  { x: 500, y: 250, colorGroup: 'parchment' },  // 26
  { x: 400, y: 250, colorGroup: 'cyan' },       // 27 (Evento)
  { x: 300, y: 250, colorGroup: 'cyan' },       // 28
  { x: 200, y: 250, colorGroup: 'orange' },     // 29 (Evento)
  { x: 100, y: 250, colorGroup: 'orange' },     // 30

  // LEFT TURN 3 (Tiles 31-32): Curve up from Y=250 to Y=90
  { x: 50,  y: 170, colorGroup: 'pink' },       // 31
  { x: 100, y: 90,  colorGroup: 'pink' },       // 32 (Evento)

  // TIER 4 (Top Row, Y=90): Left -> Right (Tiles 33-40)
  { x: 200, y: 90,  colorGroup: 'parchment' },  // 33
  { x: 300, y: 90,  colorGroup: 'parchment' },  // 34 (Evento)
  { x: 400, y: 90,  colorGroup: 'cyan' },       // 35
  { x: 500, y: 90,  colorGroup: 'cyan' },       // 36 (Evento)
  { x: 600, y: 90,  colorGroup: 'orange' },     // 37
  { x: 700, y: 90,  colorGroup: 'orange' },     // 38 (Evento)
  { x: 800, y: 90,  colorGroup: 'pink' },       // 39
  { x: 910, y: 90,  colorGroup: 'pink' }        // 40 (Deploy)
];

/**
 * Mobile 10-tier Serpentine Track Coordinates (400 x 1000 viewBox)
 * 10 rows x 4 tiles = 40 tiles (9 S-curves / voltas)
 */
export const TILE_PATH_COORDINATES_MOBILE: TileCoordinate[] = [
  // ROW 1 (Y=920): Right -> Left (Tiles 1-4)
  { x: 330, y: 920, colorGroup: 'parchment' },  // 1 (Início)
  { x: 240, y: 920, colorGroup: 'parchment' },  // 2
  { x: 150, y: 920, colorGroup: 'cyan' },       // 3 (Evento)
  { x: 60,  y: 920, colorGroup: 'cyan' },       // 4

  // ROW 2 (Y=825): Left -> Right (Tiles 5-8)
  { x: 60,  y: 825, colorGroup: 'orange' },     // 5
  { x: 150, y: 825, colorGroup: 'orange' },     // 6 (Evento)
  { x: 240, y: 825, colorGroup: 'pink' },       // 7
  { x: 330, y: 825, colorGroup: 'pink' },       // 8 (Evento)

  // ROW 3 (Y=730): Right -> Left (Tiles 9-12)
  { x: 330, y: 730, colorGroup: 'parchment' },  // 9
  { x: 240, y: 730, colorGroup: 'parchment' },  // 10
  { x: 150, y: 730, colorGroup: 'cyan' },       // 11 (Evento)
  { x: 60,  y: 730, colorGroup: 'cyan' },       // 12

  // ROW 4 (Y=635): Left -> Right (Tiles 13-16)
  { x: 60,  y: 635, colorGroup: 'orange' },     // 13
  { x: 150, y: 635, colorGroup: 'orange' },     // 14 (Evento)
  { x: 240, y: 635, colorGroup: 'pink' },       // 15
  { x: 330, y: 635, colorGroup: 'pink' },       // 16 (Evento)

  // ROW 5 (Y=540): Right -> Left (Tiles 17-20)
  { x: 330, y: 540, colorGroup: 'parchment' },  // 17
  { x: 240, y: 540, colorGroup: 'parchment' },  // 18
  { x: 150, y: 540, colorGroup: 'cyan' },       // 19 (Evento)
  { x: 60,  y: 540, colorGroup: 'cyan' },       // 20

  // ROW 6 (Y=445): Left -> Right (Tiles 21-24)
  { x: 60,  y: 445, colorGroup: 'orange' },     // 21 (Evento)
  { x: 150, y: 445, colorGroup: 'orange' },     // 22
  { x: 240, y: 445, colorGroup: 'pink' },       // 23
  { x: 330, y: 445, colorGroup: 'pink' },       // 24 (Evento)

  // ROW 7 (Y=350): Right -> Left (Tiles 25-28)
  { x: 330, y: 350, colorGroup: 'parchment' },  // 25
  { x: 240, y: 350, colorGroup: 'parchment' },  // 26
  { x: 150, y: 350, colorGroup: 'cyan' },       // 27 (Evento)
  { x: 60,  y: 350, colorGroup: 'cyan' },       // 28

  // ROW 8 (Y=255): Left -> Right (Tiles 29-32)
  { x: 60,  y: 255, colorGroup: 'orange' },     // 29 (Evento)
  { x: 150, y: 255, colorGroup: 'orange' },     // 30
  { x: 240, y: 255, colorGroup: 'pink' },       // 31
  { x: 330, y: 255, colorGroup: 'pink' },       // 32 (Evento)

  // ROW 9 (Y=160): Right -> Left (Tiles 33-36)
  { x: 330, y: 160, colorGroup: 'parchment' },  // 33
  { x: 240, y: 160, colorGroup: 'parchment' },  // 34 (Evento)
  { x: 150, y: 160, colorGroup: 'cyan' },       // 35
  { x: 60,  y: 160, colorGroup: 'cyan' },       // 36 (Evento)

  // ROW 10 (Y=65): Left -> Right (Tiles 37-40)
  { x: 60,  y: 65,  colorGroup: 'orange' },     // 37
  { x: 150, y: 65,  colorGroup: 'orange' },     // 38 (Evento)
  { x: 240, y: 65,  colorGroup: 'pink' },       // 39
  { x: 330, y: 65,  colorGroup: 'pink' }        // 40 (Deploy)
];

/**
 * Tablet 6-tier Serpentine Track Coordinates (700 x 750 viewBox)
 * 6 rows (7 tiles/row) = 40 tiles (5 S-curves / voltas)
 */
export const TILE_PATH_COORDINATES_TABLET: TileCoordinate[] = [
  // ROW 1 (Y=670): Right -> Left (Tiles 1-7)
  { x: 620, y: 670, colorGroup: 'parchment' },  // 1 (Início)
  { x: 530, y: 670, colorGroup: 'parchment' },  // 2
  { x: 440, y: 670, colorGroup: 'cyan' },       // 3 (Evento)
  { x: 350, y: 670, colorGroup: 'cyan' },       // 4
  { x: 260, y: 670, colorGroup: 'orange' },     // 5
  { x: 170, y: 670, colorGroup: 'orange' },     // 6 (Evento)
  { x: 80,  y: 670, colorGroup: 'pink' },       // 7

  // ROW 2 (Y=550): Left -> Right (Tiles 8-14)
  { x: 80,  y: 550, colorGroup: 'pink' },       // 8 (Evento)
  { x: 170, y: 550, colorGroup: 'parchment' },  // 9
  { x: 260, y: 550, colorGroup: 'parchment' },  // 10
  { x: 350, y: 550, colorGroup: 'cyan' },       // 11 (Evento)
  { x: 440, y: 550, colorGroup: 'cyan' },       // 12
  { x: 530, y: 550, colorGroup: 'orange' },     // 13
  { x: 620, y: 550, colorGroup: 'orange' },     // 14 (Evento)

  // ROW 3 (Y=430): Right -> Left (Tiles 15-21)
  { x: 620, y: 430, colorGroup: 'pink' },       // 15
  { x: 530, y: 430, colorGroup: 'pink' },       // 16 (Evento)
  { x: 440, y: 430, colorGroup: 'parchment' },  // 17
  { x: 350, y: 430, colorGroup: 'parchment' },  // 18
  { x: 260, y: 430, colorGroup: 'cyan' },       // 19 (Evento)
  { x: 170, y: 430, colorGroup: 'cyan' },       // 20
  { x: 80,  y: 430, colorGroup: 'orange' },     // 21 (Evento)

  // ROW 4 (Y=310): Left -> Right (Tiles 22-28)
  { x: 80,  y: 310, colorGroup: 'orange' },     // 22
  { x: 170, y: 310, colorGroup: 'pink' },       // 23
  { x: 260, y: 310, colorGroup: 'pink' },       // 24 (Evento)
  { x: 350, y: 310, colorGroup: 'parchment' },  // 25
  { x: 440, y: 310, colorGroup: 'parchment' },  // 26
  { x: 530, y: 310, colorGroup: 'cyan' },       // 27 (Evento)
  { x: 620, y: 310, colorGroup: 'cyan' },       // 28

  // ROW 5 (Y=190): Right -> Left (Tiles 29-35)
  { x: 620, y: 190, colorGroup: 'orange' },     // 29 (Evento)
  { x: 530, y: 190, colorGroup: 'orange' },     // 30
  { x: 440, y: 190, colorGroup: 'pink' },       // 31
  { x: 350, y: 190, colorGroup: 'pink' },       // 32 (Evento)
  { x: 260, y: 190, colorGroup: 'parchment' },  // 33
  { x: 170, y: 190, colorGroup: 'parchment' },  // 34 (Evento)
  { x: 80,  y: 190, colorGroup: 'cyan' },       // 35

  // ROW 6 (Y=70): Left -> Right (Tiles 36-40)
  { x: 80,  y: 70,  colorGroup: 'cyan' },       // 36 (Evento)
  { x: 170, y: 70,  colorGroup: 'orange' },     // 37
  { x: 260, y: 70,  colorGroup: 'orange' },     // 38 (Evento)
  { x: 350, y: 70,  colorGroup: 'pink' },       // 39
  { x: 440, y: 70,  colorGroup: 'pink' }        // 40 (Deploy)
];

// Backwards compatibility alias
export const TILE_PATH_COORDINATES = TILE_PATH_COORDINATES_DESKTOP;

export function getTileCoordinate(tileNum: number, screenMode: 'mobile' | 'tablet' | 'desktop' = 'desktop'): TileCoordinate {
  const coords =
    screenMode === 'mobile'
      ? TILE_PATH_COORDINATES_MOBILE
      : screenMode === 'tablet'
      ? TILE_PATH_COORDINATES_TABLET
      : TILE_PATH_COORDINATES_DESKTOP;
  const index = Math.max(0, Math.min(39, tileNum - 1));
  return coords[index];
}

