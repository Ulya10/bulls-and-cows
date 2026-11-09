import { describe, it, expect } from "vitest";
import {
  createInitialState,
  startGame,
  addAttempt,
  finishGame,
  isGameWon,
} from "../../src/core/state";

const SETTINGS = { length: 4, base: 10 };
const SECRET = "1234";

describe("state", () => {
  describe("createInitialState", () => {
    it("starts in settings status", () => {
      const state = createInitialState();
      expect(state.status).toBe("settings");
      expect(state.history).toEqual([]);
    });
  });

  describe("startGame", () => {
    it("returns playing state with given settings and secret", () => {
      const state = startGame(SETTINGS, SECRET, 1000);
      expect(state.status).toBe("playing");
      expect(state.settings).toEqual(SETTINGS);
      expect(state.secret).toBe(SECRET);
      expect(state.history).toEqual([]);
      expect(state.startTime).toBe(1000);
      expect(state.duration).toBe(0);
    });
  });

  describe("addAttempt with immutability", () => {
    it("returns a new state with the attempt appended", () => {
      const before = startGame(SETTINGS, SECRET, 1000);
      const after = addAttempt(before, "5678", { bulls: 0, cows: 0 });

      expect(after.history).toHaveLength(1);
      expect(after.history[0]).toEqual({ guess: "5678", bulls: 0, cows: 0 });
    });

    it("does not mutate the previous state", () => {
      const before = startGame(SETTINGS, SECRET, 1000);
      addAttempt(before, "5678", { bulls: 0, cows: 0 });

      expect(before.history).toHaveLength(0);
    });
  });

  describe("isGameWon", () => {
    it("returns true when last attempt has bulls = length", () => {
      const state = addAttempt(startGame(SETTINGS, SECRET, 1000), "1234", { bulls: 4, cows: 0 });
      expect(isGameWon(state)).toBe(true);
    });

    it("returns false when bulls < length", () => {
      const state = addAttempt(startGame(SETTINGS, SECRET, 1000), "1235", { bulls: 3, cows: 0 });
      expect(isGameWon(state)).toBe(false);
    });

    it("returns false when history is empty", () => {
      expect(isGameWon(startGame(SETTINGS, SECRET, 1000))).toBe(false);
    });
  });

  describe("finishGame", () => {
    it("returns a new state with status 'won' and duration set", () => {
      const before = startGame(SETTINGS, SECRET, 1000);
      const after = finishGame(before, 5500);

      expect(after.status).toBe("won");
      expect(after.duration).toBe(4500);
      expect(before.status).toBe("playing");
    });
  });
});
