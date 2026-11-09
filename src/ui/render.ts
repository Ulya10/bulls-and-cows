import type { GameState } from "../core/state";
import { countPossibleSecrets } from "../core/countPossibleSecrets";
import { createDigitValidator } from "../core/createDigitValidator";

const BASES: ReadonlyArray<{ name: string; value: number }> = [
  { name: "bin", value: 2 },
  { name: "oct", value: 8 },
  { name: "dec", value: 10 },
  { name: "hex", value: 16 },
];

const el = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Partial<HTMLElementTagNameMap[K]> = {},
  children: (Node | string)[] = [],
): HTMLElementTagNameMap[K] => {
  const node = document.createElement(tag);
  Object.assign(node, props);
  for (const child of children) {
    node.append(typeof child === "string" ? document.createTextNode(child) : child);
  }
  return node;
};

export type SettingsForm = {
  length: number;
  base: number;
};

export type RenderCallbacks = {
  onStart: (settings: SettingsForm) => void;
  onGuess: (guess: string) => void;
  onNewGame: () => void;
};

export const clearRoot = (root: HTMLElement): void => {
  root.replaceChildren();
};

export const renderSettings = (root: HTMLElement, cb: RenderCallbacks): void => {
  clearRoot(root);

  const lengthSelect = el("select", { id: "length" });
  for (const n of [2, 3, 4, 5, 6]) {
    lengthSelect.append(el("option", { value: String(n) }, [String(n)]));
  }
  lengthSelect.value = "4";

  const baseSelect = el("select", { id: "base" });
  for (const b of BASES) {
    baseSelect.append(el("option", { value: String(b.value) }, [b.name]));
  }
  baseSelect.value = "10";

  const possible = el("p", { className: "hint" }, [""]);

  const updatePossible = (): void => {
    const length = Number(lengthSelect.value);
    const base = Number(baseSelect.value);
    const total = countPossibleSecrets(length, base);
    possible.textContent = `Возможных секретов: ${total}`;
  };

  const applyBinaryConstraint = (): void => {
    const base = Number(baseSelect.value);
    for (const option of Array.from(lengthSelect.options)) {
      if (base === 2) {
        option.disabled = option.value !== "2";
        if (lengthSelect.value !== "2") {
          lengthSelect.value = "2";
        }
      } else {
        option.disabled = false;
      }
    }
    updatePossible();
  };

  lengthSelect.addEventListener("change", updatePossible);
  baseSelect.addEventListener("change", applyBinaryConstraint);

  const startButton = el("button", { type: "button" }, ["Начать игру"]);
  startButton.addEventListener("click", () => {
    cb.onStart({
      length: Number(lengthSelect.value),
      base: Number(baseSelect.value),
    });
  });

  const form = el("section", { className: "settings" }, [
    el("h1", {}, ["Bulls and Cows"]),
    el("label", {}, ["Длина: ", lengthSelect]),
    el("label", {}, ["Система: ", baseSelect]),
    possible,
    startButton,
  ]);

  root.append(form);
  applyBinaryConstraint();
};

export const renderGame = (root: HTMLElement, state: GameState, cb: RenderCallbacks): void => {
  clearRoot(root);

  const guessInput = el("input", {
    id: "guess",
    type: "text",
    maxLength: state.settings.length,
    autocomplete: "off",
  });

  const isDigit = createDigitValidator(state.settings.base);
  guessInput.addEventListener("input", () => {
    const filtered = [...guessInput.value]
      .filter((c) => isDigit(c))
      .join("")
      .slice(0, state.settings.length);
    if (filtered !== guessInput.value) {
      guessInput.value = filtered;
    }
  });

  const submit = el("button", { type: "button" }, ["Проверить"]);
  submit.addEventListener("click", () => {
    const guess = guessInput.value;
    if (guess.length !== state.settings.length) {
      return;
    }
    cb.onGuess(guess);
  });

  const history = el("ol", { className: "history" });
  for (const attempt of state.history) {
    history.append(
      el("li", {}, [`${attempt.guess} — bulls: ${attempt.bulls}, cows: ${attempt.cows}`]),
    );
  }

  const newGame = el("button", { type: "button", className: "secondary" }, ["Новая игра"]);
  newGame.addEventListener("click", cb.onNewGame);

  root.append(
    el("section", { className: "game" }, [
      el("h2", {}, [`Длина ${state.settings.length}, система ${state.settings.base}`]),
      el("label", {}, ["Попытка: ", guessInput]),
      submit,
      history,
      newGame,
    ]),
  );
};

export const renderWin = (root: HTMLElement, state: GameState, cb: RenderCallbacks): void => {
  clearRoot(root);

  const seconds = (state.duration / 1000).toFixed(1);
  const newGame = el("button", { type: "button" }, ["Новая игра"]);
  newGame.addEventListener("click", cb.onNewGame);

  root.append(
    el("section", { className: "win" }, [
      el("h2", {}, ["Победа!"]),
      el("p", {}, [`Попыток: ${state.history.length}`]),
      el("p", {}, [`Время: ${seconds} с`]),
      el("p", {}, [`Секрет: ${state.secret}`]),
      newGame,
    ]),
  );
};
