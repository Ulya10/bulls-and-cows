const digits = "0123456789abcdef";
const pickUnique = (pool, count, random) => {
    if (count === 0 || pool.length === 0) {
        return [];
    }
    const index = Math.floor(random() * pool.length);
    const char = pool[index];
    const rest = pool.filter((_, i) => i !== index);
    return [char, ...pickUnique(rest, count - 1, random)];
};
export const generateSecret = (length, base, random = Math.random) => {
    if (length <= 0 || length > base) {
        return "";
    }
    const pool = [...digits.slice(0, base)];
    return pickUnique(pool, length, random).join("");
};
//# sourceMappingURL=generateSecret.js.map