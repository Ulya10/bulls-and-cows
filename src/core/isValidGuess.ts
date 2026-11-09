import { createDigitValidator } from "./createDigitValidator";

export const isValidGuess = (guess: string, length: number, base: number): boolean => {
  if (guess.length !== length) {
    return false;
  }

  const isValidDigit = createDigitValidator(base);

  const allDigitsValid = [...guess].every(isValidDigit);
  if (!allDigitsValid) {
    return false;
  }

  const uniqueDigits = new Set(guess);
  return uniqueDigits.size === guess.length;
};
