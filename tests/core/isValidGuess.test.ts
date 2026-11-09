import { describe, it, expect } from "vitest";
import { isValidGuess } from "../../src/core/isValidGuess.js";

describe("isValidGuess", () => {
  it("returns true for a valid guess", () => {
    expect(isValidGuess("1234", 4, 10)).toBe(true);
  });

  it("returns false when length is wrong", () => {
    expect(isValidGuess("123", 4, 10)).toBe(false);
    expect(isValidGuess("12345", 4, 10)).toBe(false);
  });

  it("returns false when a digit is invalid for base", () => {
    expect(isValidGuess("12a4", 4, 10)).toBe(false);
    expect(isValidGuess("0122", 4, 2)).toBe(false);
  });

  it("returns true for valid hex with lowercase and uppercase", () => {
    expect(isValidGuess("a1f0", 4, 16)).toBe(true);
    expect(isValidGuess("A1F0", 4, 16)).toBe(true);
  });

  it("returns true when guess has a leading zero", () => {
    expect(isValidGuess("0123", 4, 10)).toBe(true);
  });

  it("returns false when digits are not unique", () => {
    expect(isValidGuess("1123", 4, 10)).toBe(false);
    expect(isValidGuess("0000", 4, 10)).toBe(false);
  });

  it("returns true for a valid bin guess", () => {
    expect(isValidGuess("01", 2, 2)).toBe(true);
  });
});
