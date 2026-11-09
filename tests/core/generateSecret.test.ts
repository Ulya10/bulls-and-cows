import { describe, it, expect } from "vitest";
import { generateSecret } from "../../src/core/generateSecret";

describe("generateSecret", () => {
  it("returns a string of the requested length", () => {
    expect(generateSecret(4, 10, () => 0)).toHaveLength(4);
    expect(generateSecret(2, 2, () => 0)).toHaveLength(2);
  });

  it("returns unique digits", () => {
    const secret = generateSecret(6, 16, () => 0.5);
    const unique = new Set(secret);
    expect(unique.size).toBe(secret.length);
  });

  it("returns digits valid for the given base", () => {
    const secret = generateSecret(4, 2, () => 0.5);
    expect([...secret].every((c) => "01".includes(c))).toBe(true);
  });

  it("produces predictable result with random = () => 0", () => {
    expect(generateSecret(4, 10, () => 0)).toBe("0123");
    expect(generateSecret(2, 2, () => 0)).toBe("01");
    expect(generateSecret(4, 16, () => 0)).toBe("0123");
  });

  it("produces predictable result with random = () => 0.999", () => {
    expect(generateSecret(4, 10, () => 0.999)).toBe("9876");
    expect(generateSecret(2, 2, () => 0.999)).toBe("10");
    expect(generateSecret(4, 16, () => 0.999)).toBe("fedc");
  });

  it("uses the provided random function (deterministic)", () => {
    const sequence = [0.9, 0.1, 0.5, 0.0];
    let i = 0;
    const random = () => sequence[i++ % sequence.length];

    expect(generateSecret(4, 10, random)).toBe("9051");
  });

  it("returns empty string when length > base", () => {
    expect(generateSecret(5, 2, () => 0)).toBe("");
  });

  it("returns empty string when length <= 0", () => {
    expect(generateSecret(0, 10, () => 0)).toBe("");
    expect(generateSecret(-1, 10, () => 0)).toBe("");
  });
});
