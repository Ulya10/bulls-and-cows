import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default defineConfig({
  files: ["**/*.{js,ts}"],
  ignores: ["dist/**", "node_modules/**", "coverage/**"],
  extends: [js.configs.recommended, tseslint.configs.recommended, eslintConfigPrettier],
  rules: {
    "no-var": "error",
    "prefer-const": "error",
    "no-console": "warn",
  },
});
