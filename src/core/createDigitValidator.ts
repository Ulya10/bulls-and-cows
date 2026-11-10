const alldigits = "0123456789abcdef";

export const createDigitValidator =
  (base: number) =>
  (char: string): boolean => {
    if (typeof char !== "string" || char.length !== 1) {
      return false;
    }
    return alldigits.slice(0, base).includes(char.toLowerCase());
  };
