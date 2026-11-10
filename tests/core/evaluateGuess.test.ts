import { describe, it, expect } from "vitest";
import { evaluateGuess } from "../../src/core/evaluateGuess";

describe("evaluateGuess", () => {
  it("returns all bulls when guess equals secret", () => {
    expect(evaluateGuess("1234", "1234")).toEqual({ bulls: 4, cows: 0 });
  });

  it("returns all cows when digits are on wrong places", () => {
    expect(evaluateGuess("1234", "4321")).toEqual({ bulls: 0, cows: 4 });
  });

  it("returns zero bulls and zero cows when no matches", () => {
    expect(evaluateGuess("1234", "5678")).toEqual({ bulls: 0, cows: 0 });
  });

  it("returns and bulls and cows", () => {
    expect(evaluateGuess("1234", "1324")).toEqual({ bulls: 2, cows: 2 });
  });

  it("returns one bull and no cows", () => {
    expect(evaluateGuess("1234", "1567")).toEqual({ bulls: 1, cows: 0 });
  });

  it("handles leading 0", () => {
    expect(evaluateGuess("0123", "0321")).toEqual({ bulls: 2, cows: 2 });
  });

  it("handles hex digits in all cases", () => {
    expect(evaluateGuess("a1f0", "A1F0")).toEqual({ bulls: 4, cows: 0 });
  });

  it("handles hex with mixed case", () => {
    expect(evaluateGuess("a1f0", "0f1A")).toEqual({ bulls: 0, cows: 4 });
  });
});
