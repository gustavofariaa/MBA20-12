export type GamePhase =
  | 'LOBBY'
  | 'DICE_ROLL'
  | 'DICE_SETTLED'
  | 'PAWN_MOVING'
  | 'CARD_DRAW'
  | 'APPLY_EFFECT'
  | 'TURN_END'
  | 'GAME_OVER';

export type CardEffectType = 'ACCELERATION' | 'IMPEDIMENT' | 'SKIP_TURN';

export interface ChaosCard {
  id: number;
  title: string;
  category: string;
  description: string;
  chaosMetric: string; // Dynamic statistic from CHAOS report
  effectType: CardEffectType;
  effectValue: number; // Positive for forward, negative for backward, 0 for skip turn
  flavorText: string;
}

export interface Player {
  id: number;
  name: string;
  color: string;
  colorId: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  hexColor: string;
  position: number; // 0 to 40
  isPenalized: boolean; // Skip next turn flag
  avatarIcon: string;
}

export interface TileConfig {
  number: number;
  isEvent: boolean;
  isDeploy: boolean;
  isStart: boolean;
  label?: string;
}

export interface MoveLog {
  id: string;
  timestamp: string;
  player: string;
  message: string;
  type: 'roll' | 'move' | 'card' | 'penalty' | 'win';
}
