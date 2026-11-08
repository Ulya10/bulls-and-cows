import { describe, it, expect } from "vitest";
import { createDigitValidator } from "../../src/core/createDigitValidator";

describe("createDigitValidator", () => {
  it("returns a function (curried factory)", () => {
    const validator = createDigitValidator(10);
    expect(typeof validator).toBe("function");
  });

  describe("base = 2", () => {
    const isValid = createDigitValidator(2);

    it("accepts '0' and '1'", () => {
      expect(isValid("0")).toBe(true);
      expect(isValid("1")).toBe(true);
    });

    it("rejects digits outside 0-1", () => {
      expect(isValid("2")).toBe(false);
      expect(isValid("9")).toBe(false);
      expect(isValid("a")).toBe(false);
    });

    it("rejects empty string", () => {
      expect(isValid("")).toBe(false);
    });
  });

  describe("base = 8", () => {
    const isValid = createDigitValidator(8);

    it("accepts digits 0-7", () => {
      for (const c of ["0", "1", "2", "3", "4", "5", "6", "7"]) {
        expect(isValid(c)).toBe(true);
      }
    });

    it("rejects 8, 9 and letters", () => {
      expect(isValid("8")).toBe(false);
      expect(isValid("9")).toBe(false);
      expect(isValid("a")).toBe(false);
    });
  });

  describe("base = 10", () => {
    const isValid = createDigitValidator(10);

    it("accepts digits 0-9", () => {
      for (const c of ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]) {
        expect(isValid(c)).toBe(true);
      }
    });

    it("rejects letters", () => {
      expect(isValid("a")).toBe(false);
      expect(isValid("f")).toBe(false);
      expect(isValid("A")).toBe(false);
    });
  });

  describe("base = 16", () => {
    const isValid = createDigitValidator(16);

    it("accepts digits 0-9", () => {
      for (const c of ["0", "1", "5", "9"]) {
        expect(isValid(c)).toBe(true);
      }
    });

    it("accepts lowercase a-f", () => {
      for (const c of ["a", "b", "c", "d", "e", "f"]) {
        expect(isValid(c)).toBe(true);
      }
    });

    it("accepts uppercase A-F", () => {
      for (const c of ["A", "B", "C", "D", "E", "F"]) {
        expect(isValid(c)).toBe(true);
      }
    });

    it("rejects letters outside a-f", () => {
      expect(isValid("g")).toBe(false);
      expect(isValid("G")).toBe(false);
      expect(isValid("z")).toBe(false);
    });
  });

  it("creates independent validators for different bases", () => {
    const isBin = createDigitValidator(2);
    const isDec = createDigitValidator(10);

    expect(isBin("2")).toBe(false);
    expect(isDec("2")).toBe(true);
  });
});
