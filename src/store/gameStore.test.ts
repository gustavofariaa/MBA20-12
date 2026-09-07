import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useGameStore } from './useGameStore';
import { CHAOS_CARDS } from '@/data/chaosCards';
import { BOARD_TILES } from '@/data/boardConfig';

describe('Trilha do Release - Core Game Engine Tests', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  it('US06: Should initialize lobby with 1 to 4 players correctly at Tile 1 with selected colorId and iconSymbol', () => {
    const store = useGameStore.getState();
    store.startGame([
      { name: 'Scrum Master', colorId: 'red', iconSymbol: 'rocket' },
      { name: 'Product Owner', colorId: 'blue', iconSymbol: 'bolt' }
    ]);

    const state = useGameStore.getState();
    expect(state.phase).toBe('DICE_ROLL');
    expect(state.players.length).toBe(2);
    expect(state.players[0].name).toBe('Scrum Master');
    expect(state.players[0].colorId).toBe('red');
    expect(state.players[0].avatarIcon).toBe('rocket');
    expect(state.players[0].position).toBe(1);
    expect(state.players[1].position).toBe(1);
  });

  it('Should prevent duplicate colors and icons when initializing multiple players', () => {
    const store = useGameStore.getState();
    // Attempting to pass identical colors and icons for 4 players
    store.startGame([
      { name: 'P1', colorId: 'red', iconSymbol: 'rocket' },
      { name: 'P2', colorId: 'red', iconSymbol: 'rocket' },
      { name: 'P3', colorId: 'red', iconSymbol: 'rocket' },
      { name: 'P4', colorId: 'red', iconSymbol: 'rocket' }
    ]);

    const state = useGameStore.getState();
    expect(state.players.length).toBe(4);

    const colors = state.players.map((p) => p.colorId);
    const icons = state.players.map((p) => p.avatarIcon);

    // Verify all colors and icons are unique
    expect(new Set(colors).size).toBe(4);
    expect(new Set(icons).size).toBe(4);
  });

  it('Should reject updatePlayerCustomization if color or icon is already taken by another player during LOBBY', () => {
    // Initialize players in LOBBY phase
    useGameStore.setState({
      phase: 'LOBBY',
      players: [
        { id: 1, name: 'Dev 1', color: 'Vermelho', colorId: 'red', bgClass: 'bg-red-500', borderClass: '', textClass: '', hexColor: '', position: 1, isPenalized: false, avatarIcon: 'rocket' },
        { id: 2, name: 'Dev 2', color: 'Azul', colorId: 'blue', bgClass: 'bg-blue-500', borderClass: '', textClass: '', hexColor: '', position: 1, isPenalized: false, avatarIcon: 'bolt' }
      ]
    });

    const store = useGameStore.getState();

    // Attempting to change P2 to 'red' (taken by P1)
    store.updatePlayerCustomization(2, 'red', 'star');
    expect(useGameStore.getState().players[1].colorId).toBe('blue'); // Should remain blue

    // Attempting to change P2 to 'rocket' (taken by P1)
    store.updatePlayerCustomization(2, 'yellow', 'rocket');
    expect(useGameStore.getState().players[1].avatarIcon).toBe('bolt'); // Should remain bolt

    // Valid update to unused color 'green' and icon 'star'
    store.updatePlayerCustomization(2, 'green', 'star');
    expect(useGameStore.getState().players[1].colorId).toBe('green');
    expect(useGameStore.getState().players[1].avatarIcon).toBe('star');
  });

  it('Should block updatePlayerCustomization once game is in progress (phase !== LOBBY)', () => {
    const store = useGameStore.getState();
    store.startGame([
      { name: 'Dev 1', colorId: 'red', iconSymbol: 'rocket' },
      { name: 'Dev 2', colorId: 'blue', iconSymbol: 'bolt' }
    ]);

    // Attempting to change P1 customization after game started
    store.updatePlayerCustomization(1, 'yellow', 'star');
    expect(useGameStore.getState().players[0].colorId).toBe('red');
    expect(useGameStore.getState().players[0].avatarIcon).toBe('rocket');
  });

  it('US01: Should contain exactly 40 board tiles with tile 40 marked as DEPLOY and tile 39 as an event', () => {
    expect(BOARD_TILES.length).toBe(40);
    expect(BOARD_TILES[0].isStart).toBe(true);
    expect(BOARD_TILES[38].isEvent).toBe(true);
    expect(BOARD_TILES[38].number).toBe(39);
    expect(BOARD_TILES[39].isDeploy).toBe(true);
    expect(BOARD_TILES[39].number).toBe(40);
  });

  it('US04: Should contain 20 distinct CHAOS Report cards', () => {
    expect(CHAOS_CARDS.length).toBe(20);
    const uniqueIds = new Set(CHAOS_CARDS.map((c) => c.id));
    expect(uniqueIds.size).toBe(20);
  });

  it('US07: Should trigger GAME_OVER phase and declare winner when reaching tile 40', () => {
    const store = useGameStore.getState();
    store.startGame([{ name: 'Dev Lead', colorId: 'purple', iconSymbol: '👑' }]);
    
    // Simulate landing at tile 40
    useGameStore.getState().evaluateTileArrival(1, 40);

    const state = useGameStore.getState();
    expect(state.phase).toBe('GAME_OVER');
    expect(state.winner?.name).toBe('Dev Lead');
  });

  it('US05: Should correctly apply card effect penalties and accelerations', async () => {
    vi.useFakeTimers();
    const store = useGameStore.getState();
    store.startGame([{ name: 'QA Analyst', colorId: 'pink', iconSymbol: '👾' }]);

    // Test acceleration card (+2)
    useGameStore.setState({
      activeCard: {
        id: 99,
        title: 'Teste de Automação',
        category: 'Sucesso',
        description: 'Avanço extra',
        chaosMetric: 'Metric test',
        effectType: 'ACCELERATION',
        effectValue: 2,
        flavorText: 'Test'
      }
    });

    const promise = useGameStore.getState().applyActiveCardEffect();
    await vi.runAllTimersAsync();
    await promise;
    vi.useRealTimers();

    const updatedState = useGameStore.getState();
    expect(updatedState.players[0].position).toBe(3); // 1 + 2 = 3
  });

  it('US05: Should clear penalty flag and allow penalized player to pass turn', () => {
    const store = useGameStore.getState();
    store.startGame([
      { name: 'P1', colorId: 'red', iconSymbol: '🚀' },
      { name: 'P2', colorId: 'blue', iconSymbol: '⚡' }
    ]);

    // Set P1 penalized
    useGameStore.setState({
      players: [
        { ...useGameStore.getState().players[0], isPenalized: true },
        useGameStore.getState().players[1]
      ]
    });

    // Roll dice when penalized
    useGameStore.getState().rollDice();

    // Penalty flag should be cleared immediately and turn passed without triggering dice roll modal
    const stateAfter = useGameStore.getState();
    expect(stateAfter.players[0].isPenalized).toBe(false);
    expect(stateAfter.isDiceRolling).toBe(false);
    expect(stateAfter.currentPlayerIndex).toBe(1);
  });

  it('Should transition through DICE_SETTLED phase when completing dice roll before moving pawn', async () => {
    vi.useFakeTimers();
    const store = useGameStore.getState();
    store.startGame([
      { name: 'P1', colorId: 'red', iconSymbol: 'rocket' }
    ]);

    const completePromise = useGameStore.getState().completeDiceRoll(4);
    
    // Advance 550ms past the 500ms post-land delay for dice face landing
    await vi.advanceTimersByTimeAsync(550);

    const settledState = useGameStore.getState();
    expect(settledState.phase).toBe('DICE_SETTLED');
    expect(settledState.diceResult).toBe(4);

    // Fast-forward remaining timers for banner and pawn steps
    await vi.runAllTimersAsync();
    await completePromise;
    vi.useRealTimers();

    const finalState = useGameStore.getState();
    expect(finalState.players[0].position).toBe(5); // 1 + 4 = 5
  });
});
