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

/* eslint-disable @typescript-eslint/no-unused-vars */
export const createInitialState = (): GameState => ({
  status: "settings",
  settings: { length: 0, base: 0 },
  secret: "",
  history: [],
  startTime: 0,
  duration: 0,
});

export const startGame = (_settings: Settings, _secret: string, _now: number): GameState => ({
  status: "settings",
  settings: { length: 0, base: 0 },
  secret: "",
  history: [],
  startTime: 0,
  duration: 0,
});

export const addAttempt = (
  state: GameState,
  _guess: string,
  _evaluation: { bulls: number; cows: number },
): GameState => state;

export const isGameWon = (_state: GameState): boolean => false;

export const finishGame = (state: GameState, _now: number): GameState => state;
/* eslint-enable @typescript-eslint/no-unused-vars */
