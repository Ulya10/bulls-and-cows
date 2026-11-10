export type GameStatus = "settings" | "playing" | "won";

export type Settings = {
  length: number;
  base: number;
};

export type Attempt = {
  guess: string;
  bulls: number;
  cows: number;
};

export type GameState = {
  status: GameStatus;
  settings: Settings;
  secret: string;
  history: Attempt[];
  startTime: number;
  duration: number;
};

const DEFAULT_SETTINGS: Settings = { length: 4, base: 10 };

export const createInitialState = (): GameState => ({
  status: "settings",
  settings: DEFAULT_SETTINGS,
  secret: "",
  history: [],
  startTime: 0,
  duration: 0,
});

export const startGame = (settings: Settings, secret: string, now: number): GameState => ({
  status: "playing",
  settings,
  secret,
  history: [],
  startTime: now,
  duration: 0,
});

export const addAttempt = (
  state: GameState,
  guess: string,
  evaluation: { bulls: number; cows: number },
): GameState => ({
  ...state,
  history: [...state.history, { guess, ...evaluation }],
});

export const isGameWon = (state: GameState): boolean => {
  if (state.history.length === 0) {
    return false;
  }
  const last = state.history[state.history.length - 1];
  return last.bulls === state.settings.length;
};

export const finishGame = (state: GameState, now: number): GameState => ({
  ...state,
  status: "won",
  duration: now - state.startTime,
});
