import {
  METALS,
  REAGENT_ORDER,
  type MetalItem,
  type ReagentId,
} from './metals';

export type ReagentSelection = ReagentId | 'mixed';
export type GameMode = 'all13' | 'traps' | 'blitz7';
export type GameStatus = 'title' | 'playing' | 'paused' | 'gameover';

export interface QuestionCard {
  id: string; // e.g. "iron-hcl"
  metal: MetalItem;
  reagent: ReagentId;
}

export interface AnswerRecord {
  cardId: string;
  metalId: string;
  reagent: ReagentId;
  chosenReacts: boolean;
  isCorrect: boolean;
  pointsEarned: number;
}

export interface GameState {
  status: GameStatus;
  reagentSelection: ReagentSelection;
  mode: GameMode;
  deck: QuestionCard[];
  currentIndex: number;
  lives: number;
  maxLives: number;
  score: number;
  streak: number;
  bestStreak: number;
  history: AnswerRecord[];
  lastFeedback: {
    card: QuestionCard;
    chosenReacts: boolean;
    isCorrect: boolean;
    pointsEarned: number;
  } | null;
  outcome: 'none' | 'victory' | 'defeat';
}

export const INITIAL_LIVES = 3;
export const BASE_POINTS = 100;
export const STREAK_BONUS = 25;

export function shuffleList<T>(
  items: readonly T[],
  rng: () => number = Math.random
): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function buildDeck(
  reagentSelection: ReagentSelection,
  mode: GameMode,
  rng: () => number = Math.random
): QuestionCard[] {
  if (reagentSelection === 'mixed') {
    const allCombos: QuestionCard[] = [];
    for (const metal of METALS) {
      for (const reagent of REAGENT_ORDER) {
        allCombos.push({
          id: `${metal.id}-${reagent}`,
          metal,
          reagent,
        });
      }
    }

    if (mode === 'traps') {
      const traps = allCombos.filter(
        (card) => card.metal.reactions[card.reagent].isExamTrap
      );
      return shuffleList(traps, rng).slice(0, 10);
    }

    if (mode === 'blitz7') {
      return shuffleList(allCombos, rng).slice(0, 7);
    }

    // Standard mixed round: 13 cards covering all 13 metals with balanced reagents
    const shuffledReagents = shuffleList(REAGENT_ORDER, rng);
    const balancedCards = METALS.map((metal, idx) => {
      const reagent = shuffledReagents[idx % shuffledReagents.length];
      return {
        id: `${metal.id}-${reagent}`,
        metal,
        reagent,
      };
    });
    return shuffleList(balancedCards, rng);
  }

  const singleReagentCards: QuestionCard[] = METALS.map((metal) => ({
    id: `${metal.id}-${reagentSelection}`,
    metal,
    reagent: reagentSelection,
  }));

  if (mode === 'traps') {
    const traps = singleReagentCards.filter(
      (card) => card.metal.reactions[reagentSelection].isExamTrap
    );
    return shuffleList(traps.length >= 3 ? traps : singleReagentCards, rng);
  }

  if (mode === 'blitz7') {
    return shuffleList(singleReagentCards, rng).slice(0, 7);
  }

  return shuffleList(singleReagentCards, rng);
}

export function createInitialState(
  reagentSelection: ReagentSelection = 'hcl',
  mode: GameMode = 'all13',
  startImmediately = false,
  rng: () => number = Math.random
): GameState {
  return {
    status: startImmediately ? 'playing' : 'title',
    reagentSelection,
    mode,
    deck: buildDeck(reagentSelection, mode, rng),
    currentIndex: 0,
    lives: INITIAL_LIVES,
    maxLives: INITIAL_LIVES,
    score: 0,
    streak: 0,
    bestStreak: 0,
    history: [],
    lastFeedback: null,
    outcome: 'none',
  };
}

export function submitChoice(
  state: GameState,
  chosenReacts: boolean
): GameState {
  if (state.status !== 'playing' || state.lastFeedback !== null) {
    return state;
  }

  const currentCard = state.deck[state.currentIndex];
  if (!currentCard) {
    return state;
  }

  const expectedReacts =
    currentCard.metal.reactions[currentCard.reagent].reacts;
  const isCorrect = expectedReacts === chosenReacts;
  const nextStreak = isCorrect ? state.streak + 1 : 0;
  const pointsEarned = isCorrect
    ? BASE_POINTS + Math.max(0, nextStreak - 1) * STREAK_BONUS
    : 0;
  const nextLives = isCorrect ? state.lives : Math.max(0, state.lives - 1);

  const record: AnswerRecord = {
    cardId: currentCard.id,
    metalId: currentCard.metal.id,
    reagent: currentCard.reagent,
    chosenReacts,
    isCorrect,
    pointsEarned,
  };

  return {
    ...state,
    lives: nextLives,
    score: state.score + pointsEarned,
    streak: nextStreak,
    bestStreak: Math.max(state.bestStreak, nextStreak),
    history: [...state.history, record],
    lastFeedback: {
      card: currentCard,
      chosenReacts,
      isCorrect,
      pointsEarned,
    },
  };
}

export function advanceRound(state: GameState): GameState {
  if (state.status !== 'playing' || state.lastFeedback === null) {
    return state;
  }

  if (state.lives <= 0) {
    return {
      ...state,
      status: 'gameover',
      lastFeedback: null,
      outcome: 'defeat',
    };
  }

  const nextIndex = state.currentIndex + 1;
  if (nextIndex >= state.deck.length) {
    return {
      ...state,
      status: 'gameover',
      lastFeedback: null,
      outcome: 'victory',
    };
  }

  return {
    ...state,
    currentIndex: nextIndex,
    lastFeedback: null,
  };
}

export function computeAccuracyPercent(history: readonly AnswerRecord[]): number {
  if (history.length === 0) return 0;
  const correct = history.filter((item) => item.isCorrect).length;
  return Math.round((correct / history.length) * 100);
}
