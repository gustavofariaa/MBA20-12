import { create } from 'zustand';
import { ChaosCard, GamePhase, MoveLog, Player } from '@/types/game';
import { CHAOS_CARDS } from '@/data/chaosCards';
import { BOARD_TILES } from '@/data/boardConfig';
import { VINTAGE_COLOR_OPTIONS, VINTAGE_ICON_OPTIONS } from '@/data/playerCustomization';
import { soundManager } from '@/utils/soundManager';

export interface PlayerInput {
  name: string;
  colorId: string;
  iconSymbol: string;
}

interface GameState {
  phase: GamePhase;
  players: Player[];
  currentPlayerIndex: number;
  diceResult: number | null;
  pendingDiceRoll: number | null;
  isDiceRolling: boolean;
  activeCard: ChaosCard | null;
  winner: Player | null;
  moveLogs: MoveLog[];
  drawnCardIds: number[];

  // Actions
  startGame: (playerInputs: PlayerInput[]) => void;
  rollDice: () => void;
  completeDiceRoll: (rollValue: number) => void;
  setPlayerPosition: (playerId: number, newPosition: number) => void;
  evaluateTileArrival: (playerId: number, position: number) => void;
  applyActiveCardEffect: () => void;
  updatePlayerCustomization: (playerId: number, colorId: string, iconSymbol: string) => void;
  endTurn: () => void;
  resetGame: () => void;
  addLog: (message: string, type: MoveLog['type'], playerName?: string) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  phase: 'LOBBY',
  players: [],
  currentPlayerIndex: 0,
  diceResult: null,
  pendingDiceRoll: null,
  isDiceRolling: false,
  activeCard: null,
  winner: null,
  moveLogs: [],
  drawnCardIds: [],

  addLog: (message: string, type: MoveLog['type'], playerName?: string) => {
    const log: MoveLog = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      player: playerName || 'Sistema',
      message,
      type
    };
    set((state) => ({ moveLogs: [log, ...state.moveLogs].slice(0, 50) }));
  },

  startGame: (playerInputs: PlayerInput[]) => {
    const usedColors: string[] = [];
    const usedIcons: string[] = [];

    const initializedPlayers: Player[] = playerInputs.map((input, index) => {
      let selectedColor = VINTAGE_COLOR_OPTIONS.find((c) => c.id === input.colorId && !usedColors.includes(c.id));
      if (!selectedColor) {
        selectedColor = VINTAGE_COLOR_OPTIONS.find((c) => !usedColors.includes(c.id)) || VINTAGE_COLOR_OPTIONS[index % VINTAGE_COLOR_OPTIONS.length];
      }
      usedColors.push(selectedColor.id);

      let selectedIcon = VINTAGE_ICON_OPTIONS.find((i) => i.symbol === input.iconSymbol && !usedIcons.includes(i.symbol));
      if (!selectedIcon) {
        selectedIcon = VINTAGE_ICON_OPTIONS.find((i) => !usedIcons.includes(i.symbol)) || VINTAGE_ICON_OPTIONS[index % VINTAGE_ICON_OPTIONS.length];
      }
      usedIcons.push(selectedIcon.symbol);

      return {
        id: index + 1,
        name: input.name.trim() || `Gerente ${index + 1}`,
        color: selectedColor.name,
        colorId: selectedColor.id,
        bgClass: selectedColor.bgClass,
        borderClass: selectedColor.borderClass,
        textClass: selectedColor.textClass,
        hexColor: selectedColor.hex,
        position: 1, // Start tile 1
        isPenalized: false,
        avatarIcon: selectedIcon.symbol
      };
    });

    set({
      phase: 'DICE_ROLL',
      players: initializedPlayers,
      currentPlayerIndex: 0,
      diceResult: null,
      pendingDiceRoll: null,
      isDiceRolling: false,
      activeCard: null,
      winner: null,
      moveLogs: [],
      drawnCardIds: []
    });

    get().addLog(`Partida iniciada com ${initializedPlayers.length} jogador(es). Vez de ${initializedPlayers[0].name}.`, 'roll');
  },

  updatePlayerCustomization: (playerId: number, colorId: string, iconSymbol: string) => {
    const { phase, players } = get();
    if (phase !== 'LOBBY') return;

    const isColorTaken = players.some((p) => p.id !== playerId && p.colorId === colorId);
    const isIconTaken = players.some((p) => p.id !== playerId && p.avatarIcon === iconSymbol);

    if (isColorTaken || isIconTaken) return;

    const selectedColor = VINTAGE_COLOR_OPTIONS.find((c) => c.id === colorId);
    const selectedIcon = VINTAGE_ICON_OPTIONS.find((i) => i.symbol === iconSymbol);

    if (!selectedColor || !selectedIcon) return;

    set((state) => ({
      players: state.players.map((p) =>
        p.id === playerId
          ? {
              ...p,
              color: selectedColor.name,
              colorId: selectedColor.id,
              bgClass: selectedColor.bgClass,
              borderClass: selectedColor.borderClass,
              textClass: selectedColor.textClass,
              hexColor: selectedColor.hex,
              avatarIcon: selectedIcon.symbol
            }
          : p
      )
    }));
  },

  rollDice: () => {
    const { phase, players, currentPlayerIndex, isDiceRolling } = get();
    if (phase !== 'DICE_ROLL' || isDiceRolling) return;

    const currentPlayer = players[currentPlayerIndex];

    // Check if player is penalized (skips turn)
    if (currentPlayer.isPenalized) {
      get().addLog(`${currentPlayer.name} cumpriu penalidade de turno (Relatório CHAOS) e passou a vez.`, 'penalty', currentPlayer.name);
      
      // Remove penalty for next round
      set((state) => ({
        players: state.players.map((p, idx) =>
          idx === currentPlayerIndex ? { ...p, isPenalized: false } : p
        )
      }));

      // Directly end turn without triggering dice roll modal
      get().endTurn();
      return;
    }

    // Generate RNG D6 (1 to 6)
    const rollValue = Math.floor(Math.random() * 6) + 1;

    // Reset previous diceResult, set pendingDiceRoll, and start rolling animation
    set({ isDiceRolling: true, diceResult: null, pendingDiceRoll: rollValue });

    // Wait 2000ms for dramatic deceleration suspense animation to complete
    setTimeout(() => {
      get().completeDiceRoll(rollValue);
    }, 2000);
  },

  completeDiceRoll: async (rollValue: number) => {
    const { players, currentPlayerIndex } = get();
    const currentPlayer = players[currentPlayerIndex];
    const targetPosition = Math.min(40, currentPlayer.position + rollValue);

    // 1. Immediately set landed diceResult, stop rolling animation, and enter DICE_SETTLED phase
    set({
      diceResult: rollValue,
      pendingDiceRoll: null,
      isDiceRolling: false,
      phase: 'DICE_SETTLED'
    });

    get().addLog(`${currentPlayer.name} rolou o dado: [ ${rollValue} ]`, 'roll', currentPlayer.name);

    // 2. Keep result on screen in the same modal for 2200ms so player reads the result comfortably
    await new Promise((resolve) => setTimeout(resolve, 2200));

    // 3. Trigger pawn movement (setPlayerPosition handles the 350ms exit transition before hopping)
    get().setPlayerPosition(currentPlayer.id, targetPosition);
  },

  setPlayerPosition: async (playerId: number, newPosition: number) => {
    const player = get().players.find((p) => p.id === playerId);
    if (!player) return;

    const startPos = player.position;
    const clampedTarget = Math.max(1, Math.min(40, newPosition));

    if (startPos === clampedTarget) {
      get().evaluateTileArrival(playerId, clampedTarget);
      return;
    }

    const isForward = clampedTarget > startPos;
    const totalSteps = Math.abs(clampedTarget - startPos);

    set({ phase: 'PAWN_MOVING' });

    // Wait 350ms for banner exit transition to finish completely before pawn hops
    await new Promise((resolve) => setTimeout(resolve, 350));

    let currentPos = startPos;
    for (let step = 1; step <= totalSteps; step++) {
      currentPos = isForward ? currentPos + 1 : currentPos - 1;

      // Update position step by step
      set((state) => ({
        players: state.players.map((p) =>
          p.id === playerId ? { ...p, position: currentPos } : p
        )
      }));

      // 300ms delay per tile step to display hop animation
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    get().addLog(
      `${player.name} ${isForward ? 'avançou' : 'recuou'} para a Casa ${clampedTarget}.`,
      'move',
      player.name
    );

    // Pause before evaluating arrival
    await new Promise((resolve) => setTimeout(resolve, 350));
    get().evaluateTileArrival(playerId, clampedTarget);
  },

  evaluateTileArrival: (playerId: number, position: number) => {
    const player = get().players.find((p) => p.id === playerId);
    if (!player) return;

    // Check Victory (Tile 40)
    if (position >= 40) {
      set({
        phase: 'GAME_OVER',
        winner: player
      });
      get().addLog(`🎉 DEPLOY REALIZADO! ${player.name} alcançou a Casa 40 e venceu a partida!`, 'win', player.name);
      return;
    }

    // Check Event Tile
    const tileConfig = BOARD_TILES.find((t) => t.number === position);
    if (tileConfig && tileConfig.isEvent) {
      soundManager.playEventLandSound();

      // Draw a CHAOS card
      const { drawnCardIds } = get();
      let availableCards = CHAOS_CARDS.filter((c) => !drawnCardIds.includes(c.id));
      
      if (availableCards.length === 0) {
        // Reset deck if all cards used
        availableCards = [...CHAOS_CARDS];
        set({ drawnCardIds: [] });
      }

      const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];

      set((state) => ({
        phase: 'CARD_DRAW',
        activeCard: randomCard,
        drawnCardIds: [...state.drawnCardIds, randomCard.id]
      }));

      get().addLog(`⚠️ ${player.name} caiu em uma Casa de Evento! Carta sacada: "${randomCard.title}"`, 'card', player.name);
      return;
    }

    // Normal tile -> End turn
    set({ phase: 'TURN_END' });
    setTimeout(() => {
      get().endTurn();
    }, 800);
  },

  applyActiveCardEffect: () => {
    const { activeCard, players, currentPlayerIndex } = get();
    if (!activeCard) return;

    const currentPlayer = players[currentPlayerIndex];

    if (activeCard.effectType === 'SKIP_TURN') {
      set((state) => ({
        phase: 'APPLY_EFFECT',
        players: state.players.map((p, idx) =>
          idx === currentPlayerIndex ? { ...p, isPenalized: true } : p
        )
      }));
      get().addLog(`${currentPlayer.name} sofreu penalidade: perderá o próximo turno!`, 'penalty', currentPlayer.name);
      
      set({ activeCard: null, phase: 'TURN_END' });
      setTimeout(() => {
        get().endTurn();
      }, 1000);

    } else {
      // Acceleration or Impediment
      const newPos = Math.max(1, Math.min(40, currentPlayer.position + activeCard.effectValue));
      get().addLog(
        `${currentPlayer.name} aplicou efeito da carta: ${activeCard.effectValue > 0 ? `+${activeCard.effectValue}` : activeCard.effectValue} casas!`,
        'card',
        currentPlayer.name
      );

      set({ activeCard: null });
      get().setPlayerPosition(currentPlayer.id, newPos);
    }
  },

  endTurn: () => {
    const { players, currentPlayerIndex, winner } = get();
    if (winner) return;

    soundManager.playTurnChangeSound();
    const nextIndex = (currentPlayerIndex + 1) % players.length;
    const nextPlayer = players[nextIndex];

    set({
      currentPlayerIndex: nextIndex,
      diceResult: null,
      activeCard: null,
      phase: 'DICE_ROLL'
    });

    get().addLog(`É a vez de ${nextPlayer.name} (Casa ${nextPlayer.position}).`, 'roll', nextPlayer.name);
  },

  resetGame: () => {
    set({
      phase: 'LOBBY',
      players: [],
      currentPlayerIndex: 0,
      diceResult: null,
      pendingDiceRoll: null,
      isDiceRolling: false,
      activeCard: null,
      winner: null,
      moveLogs: [],
      drawnCardIds: []
    });
  }
}));
