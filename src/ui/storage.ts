export type RecordEntry = {
  length: number;
  base: number;
  attempts: number;
  durationMs: number;
  at: number;
};

const KEY = "bulls-and-cows:records";
const MAX_RECORDS = 10;

export const loadRecords = (): RecordEntry[] => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (r): r is RecordEntry =>
        typeof r === "object" &&
        r !== null &&
        typeof (r as RecordEntry).length === "number" &&
        typeof (r as RecordEntry).base === "number" &&
        typeof (r as RecordEntry).attempts === "number" &&
        typeof (r as RecordEntry).durationMs === "number" &&
        typeof (r as RecordEntry).at === "number",
    );
  } catch {
    return [];
  }
};

export const saveRecord = (entry: RecordEntry): RecordEntry[] => {
  const all = [...loadRecords(), entry]
    .sort((a, b) => a.attempts - b.attempts || a.durationMs - b.durationMs)
    .slice(0, MAX_RECORDS);
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    //catch
  }
  return all;
};

export const clearRecords = (): void => {
  try {
    localStorage.removeItem(KEY);
  } catch {
    //catch
  }
};
