import { createDigitValidator } from "./createDigitValidator.js";
export const isValidGuess = (guess, length, base) => {
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
//# sourceMappingURL=isValidGuess.js.map