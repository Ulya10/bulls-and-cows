const DEFAULT_SETTINGS = { length: 4, base: 10 };
export const createInitialState = () => ({
    status: "settings",
    settings: DEFAULT_SETTINGS,
    secret: "",
    history: [],
    startTime: 0,
    duration: 0,
});
export const startGame = (settings, secret, now) => ({
    status: "playing",
    settings,
    secret,
    history: [],
    startTime: now,
    duration: 0,
});
export const addAttempt = (state, guess, evaluation) => ({
    ...state,
    history: [...state.history, { guess, ...evaluation }],
});
export const isGameWon = (state) => {
    if (state.history.length === 0) {
        return false;
    }
    const last = state.history[state.history.length - 1];
    return last.bulls === state.settings.length;
};
export const finishGame = (state, now) => ({
    ...state,
    status: "won",
    duration: now - state.startTime,
});
//# sourceMappingURL=state.js.map