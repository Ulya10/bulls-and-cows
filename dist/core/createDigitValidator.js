const alldigits = "0123456789abcdef";
export const createDigitValidator = (base) => (char) => {
    if (typeof char !== "string" || char.length !== 1) {
        return false;
    }
    return alldigits.slice(0, base).includes(char.toLowerCase());
};
//# sourceMappingURL=createDigitValidator.js.map