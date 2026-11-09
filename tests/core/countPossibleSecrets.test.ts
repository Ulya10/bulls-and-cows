import { describe, it, expect } from "vitest";
import { countPossibleSecrets, _clearMemo, _memoSize } from "../../src/core/countPossibleSecrets";

describe("countPossibleSecrets", () => {
  it("returns 1 for length 0", () => {
    expect(countPossibleSecrets(0, 10)).toBe(1);
    expect(countPossibleSecrets(0, 2)).toBe(1);
  });

  it("returns base when length is 1", () => {
    expect(countPossibleSecrets(1, 10)).toBe(10);
    expect(countPossibleSecrets(1, 2)).toBe(2);
    expect(countPossibleSecrets(1, 16)).toBe(16);
  });

  it("computes P for decimal base", () => {
    expect(countPossibleSecrets(2, 10)).toBe(90);
    expect(countPossibleSecrets(4, 10)).toBe(5040);
    expect(countPossibleSecrets(5, 10)).toBe(30240);
  });

  it("computes P for binary base", () => {
    expect(countPossibleSecrets(2, 2)).toBe(2);
  });

  it("computes Pfor hex base", () => {
    expect(countPossibleSecrets(4, 16)).toBe(43680);
    expect(countPossibleSecrets(6, 16)).toBe(5765760);
  });

  it("returns 0 when length > base", () => {
    expect(countPossibleSecrets(5, 2)).toBe(0);
    expect(countPossibleSecrets(17, 16)).toBe(0);
  });

  it("returns 0 for negative length", () => {
    expect(countPossibleSecrets(-1, 10)).toBe(0);
  });

  it("returns 0 for negative base", () => {
    expect(countPossibleSecrets(2, -1)).toBe(0);
  });

  it("repeated calls do not extend the cache", () => {
    _clearMemo();
    expect(_memoSize()).toBe(0);

    countPossibleSecrets(6, 16);
    const sizeAfterFirst = _memoSize();
    expect(sizeAfterFirst).toBeGreaterThan(0);

    countPossibleSecrets(6, 16);
    countPossibleSecrets(6, 16);
    expect(_memoSize()).toBe(sizeAfterFirst);
  });
});
