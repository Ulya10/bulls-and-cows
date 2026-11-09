type MemoKey = `${number},${number}`;
const memo = new Map<MemoKey, number>();

export const countPossibleSecrets = (length: number, base: number): number => {
  if (length < 0 || base < 0 || length > base) {
    return 0;
  }
  if (length === 0) {
    return 1;
  }

  const key = `${length},${base}` as MemoKey;
  const cached = memo.get(key);
  if (cached !== undefined) {
    return cached;
  }

  const result = base * countPossibleSecrets(length - 1, base - 1);
  memo.set(key, result);
  return result;
};
export const _clearMemo = (): void => {
  memo.clear();
};
export const _memoSize = (): number => memo.size;
