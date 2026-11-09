import { createInitialState, startGame, addAttempt, finishGame, isGameWon, } from "../core/state.js";
import { generateSecret } from "../core/generateSecret.js";
import { evaluateGuess } from "../core/evaluateGuess.js";
import { isValidGuess } from "../core/isValidGuess.js";
import { renderSettings, renderGame, renderWin } from "./render.js";
import { saveRecord } from "./storage.js";
export const createApp = (root) => {
    let state = createInitialState();
    const refresh = () => {
        if (state.status === "settings") {
            renderSettings(root, callbacks);
        }
        else if (state.status === "playing") {
            renderGame(root, state, callbacks);
        }
        else {
            renderWin(root, state, callbacks);
        }
    };
    const onStart = (settings) => {
        const secret = generateSecret(settings.length, settings.base);
        state = startGame(settings, secret, Date.now());
        refresh();
    };
    const onGuess = (guess) => {
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
            saveRecord({
                length: state.settings.length,
                base: state.settings.base,
                attempts: state.history.length,
                durationMs: state.duration,
                at: Date.now(),
            });
        }
        refresh();
    };
    const onNewGame = () => {
        state = createInitialState();
        refresh();
    };
    const callbacks = { onStart, onGuess, onNewGame };
    refresh();
    return {
        root,
        getState: () => state,
    };
};
//# sourceMappingURL=handlers.js.map