const KEY = "bulls-and-cows:records";
const MAX_RECORDS = 10;
export const loadRecords = () => {
    try {
        const raw = localStorage.getItem(KEY);
        if (!raw)
            return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed))
            return [];
        return parsed.filter((r) => typeof r === "object" &&
            r !== null &&
            typeof r.length === "number" &&
            typeof r.base === "number" &&
            typeof r.attempts === "number" &&
            typeof r.durationMs === "number" &&
            typeof r.at === "number");
    }
    catch {
        return [];
    }
};
export const saveRecord = (entry) => {
    const all = [...loadRecords(), entry]
        .sort((a, b) => a.attempts - b.attempts || a.durationMs - b.durationMs)
        .slice(0, MAX_RECORDS);
    try {
        localStorage.setItem(KEY, JSON.stringify(all));
    }
    catch {
        //catch
    }
    return all;
};
export const clearRecords = () => {
    try {
        localStorage.removeItem(KEY);
    }
    catch {
        //catch
    }
};
//# sourceMappingURL=storage.js.map