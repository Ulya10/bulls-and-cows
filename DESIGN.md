# Bulls and Cows — Design

## Архитектура

src/
├── core/ ← чистая логика (без DOM)
├── ui/ ← DOM-слой (зависит от core)
└── index.ts ← связка

## Структуры данных

### `GameState` (`src/core/state.ts`)

```typescript
type GameState = {
  status: "settings" | "playing" | "won";
  settings: { length: number; base: number };
  secret: string;
  history: Attempt[];
  startTime: number;
  duration: number;
};
type Attempt = { guess: string; bulls: number; cows: number };
```

- **Один объект** — всё состояние вместе, легко сериализовать/отлаживать.
- **`status` — union** (`"settings" | "playing" | "won"`) — взаимоисключающие состояния гарантируются **типом**.
- **`secret: string`, не `number`** — сохраняет нули (`"0123"`) и hex-буквы (`"a1f0"`). Число `0123` в JS = `123` (потеря длины/валидности).
- **`history: Attempt[]`** — порядок важен, повторы отсекаются до добавления.

### Иммутабельность

Все обновления — через spread, **без** `push`:

```typescript
export const addAttempt = (state, guess, evaluation): GameState => ({
  ...state,
  history: [...state.history, { guess, ...evaluation }],
});
```

---

## Алгоритмы

### `evaluateGuess(secret, guess)`

```typescript
const s = [...secret.toLowerCase()];
const g = [...guess.toLowerCase()];

const bulls = g.filter((c, i) => c === s[i]).length;
const secretSet = new Set(s);
const totalMatches = g.filter((c) => secretSet.has(c)).length;

return { bulls, cows: totalMatches - bulls };
```

1. **`toLowerCase`** — `"A"` и `"a"` одна цифра (требование для hex).
2. **`bulls`** — `filter` по совпадению позиции (не цикл со счётчиком).
3. **`totalMatches`** — `filter` по наличию в `Set` (O(1) lookup).

### `countPossibleSecrets(length, base)`

Формула: `P(b, n) = b! / (b-n)! = b·(b-1)·…·(b-n+1)`.

```
P(n, b) = 1,                    n = 0
P(n, b) = 0,                    n < 0, b < 0, или n > b
P(n, b) = b · P(n-1, b-1),      иначе
```

```typescript
const memo = new Map<string, number>();

export const countPossibleSecrets = (length: number, base: number): number => {
  if (length < 0 || base < 0 || length > base) return 0;
  if (length === 0) return 1;

  const key = `${length},${base}`;
  if (memo.has(key)) return memo.get(key)!;

  const result = base * countPossibleSecrets(length - 1, base - 1);
  memo.set(key, result);
  return result;
};
```

- **Рекурсия** — естественна для перестановок (1-я цифра `b` вариантов, остальные — `P(n-1, b-1)`).
- **Без факториалов** — без переполнения (16! ≈ 2·10¹³, на границе `number`).
- **Мемоизация** `Map` — функция вызывается на каждое изменение селектов; кэш делает повторные вызовы O(1).

### `generateSecret(length, base, random)`

1. Пул = `"0123456789abcdef".slice(0, base)`.
2. Рекурсивно выбрать `length` элементов:
   - `index = floor(random() * pool.length)`,
   - взять `pool[index]`,
   - новый пул = `pool.filter((_, i) => i !== index)` (**иммутабельно**).
3. Собрать в строку.

`random` **параметром** (default `Math.random`) — тестируется детерминированно (передаём последовательность → предсказуемый результат). Возврат **строки**, не числа — лидирующие нули сохраняются.

### `createDigitValidator(base)`

```typescript
export const createDigitValidator =
  (base: number) =>
  (char: string): boolean =>
    typeof char === "string" &&
    char.length === 1 &&
    "0123456789abcdef".slice(0, base).includes(char.toLowerCase());
```

**Каррирование уместно:** `base` фиксируется один раз на игру, валидатор вызывается десятки раз на каждый ввод.
---

## Сложность (Big O)

`n = length` (2–6), `b = base` (2/8/10/16).

| Функция                | Время               | Память     | Обоснование                                                                                                              |
| ---------------------- | ------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------ |
| `generateSecret`       | **O(n·b)**          | **O(n·b)** | Рекурсия глубиной `n`; на каждом уровне `filter` по пулу размера до `b` создаёт новый массив                             |
| `evaluateGuess`        | **O(n)**            | **O(n)**   | Два линейных прохода (`filter` bulls + `filter` totalMatches); `Set.has` — O(1). Не O(n²), т.к. не `includes` по массиву |
| `isValidGuess`         | **O(n)**            | **O(n)**   | Три последовательных прохода: `length` (O(1)), `every(isDigit)` (O(n)), `new Set(guess)` (O(n)). Не вложенные            |
| `countPossibleSecrets` | **O(n)** / **O(1)** | **O(n)**   | Первый вызов: рекурсия `n` уровней × O(1) работы. Повторный: `memo.get` — O(1). Кэш хранит до `n` записей                |

---

## Принципы чистого кода

| #   | Принцип                                  | Где                                                                                                                                           |
| --- | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Чистые функции** без побочных эффектов | Все в `core/`; `generateSecret` принимает `random` **параметром** вместо `Math.random` внутри                                                 |
| 2   | **Иммутабельность**                      | `state.ts::addAttempt` — `{ ...state, history: [...state.history, entry] }`; `generateSecret.ts::pickUnique` — `filter`, не `splice`          |
| 3   | **HOF** (`filter`/`every`/`map`)         | `evaluateGuess.ts` (два `filter`), `isValidGuess.ts` (`every`) — без ручных циклов со счётчиками                                              |
| 4   | **Каррирование**                         | `createDigitValidator.ts::createDigitValidator(base) → (char) => boolean`                                                                     |
| 5   | **Мемоизация**                           | `countPossibleSecrets.ts` — `Map` с ключом `"${length},${base}"`; проверяется тестом через `_memoSize()`                                      |
| 6   | **Рекурсия**                             | `generateSecret.ts::pickUnique`, `countPossibleSecrets.ts`                                                                                    |
| 7   | **Single Responsibility**                | `core/` — только логика; `render.ts` — только DOM; `handlers.ts` — только связка; `storage.ts` — только `localStorage`                        |
| 8   | **Без `innerHTML`**                      | `render.ts::el` — только `createElement` + `textContent` (XSS-защита)                                                                         |
| 9   | **TypeScript strict**                    | `tsconfig.json` — `"strict": true`; явные типы `GameState`, `Settings`, `Attempt`; `RecordEntry` с type-guard в `filter`                      |
| 10  | **ESLint + Prettier + Husky**            | `no-var`, `prefer-const`, `no-console`, `no-unused-vars`; `pre-commit` — только `lint-staged` (проверяет, не правит); `pre-push` — `npm test` |
