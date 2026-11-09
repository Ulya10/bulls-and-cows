import {
  createInitialState,
  startGame,
  addAttempt,
  finishGame,
  isGameWon,
  type GameState,
} from "../core/state";
import { generateSecret } from "../core/generateSecret";
import { evaluateGuess } from "../core/evaluateGuess";
import { isValidGuess } from "../core/isValidGuess";
import { renderSettings, renderGame, renderWin, type SettingsForm } from "./render";

export type App = {
  root: HTMLElement;
  getState: () => GameState;
};

export const createApp = (root: HTMLElement): App => {
  let state: GameState = createInitialState();

  const refresh = (): void => {
    if (state.status === "settings") {
      renderSettings(root, callbacks);
    } else if (state.status === "playing") {
      renderGame(root, state, callbacks);
    } else {
      renderWin(root, state, callbacks);
    }
  };

  const onStart = (settings: SettingsForm): void => {
    const secret = generateSecret(settings.length, settings.base);
    state = startGame(settings, secret, Date.now());
    refresh();
  };

  const onGuess = (guess: string): void => {
    if (!isValidGuess(guess, state.settings.length, state.settings.base)) {
      return;
    }

    if (state.history.some((h) => h.guess === guess)) {
      return;
    }

    const evaluation = evaluateGuess(state.secret, guess);
    state = addAttempt(state, guess, evaluation);

    if (isGameWon(state)) {
      state = finishGame(state, Date.now());
    }

    refresh();
  };

  const onNewGame = (): void => {
    state = createInitialState();
    refresh();
  };

  const callbacks = { onStart, onGuess, onNewGame };

  return {
    root,
    getState: () => state,
  };
};
