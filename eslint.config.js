import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import tanstackQuery from "@tanstack/eslint-plugin-query";

export default tseslint.config(
  {
    ignores: ["dist"],
  },
  {
    files: ["**/*.{ts,tsx}"],

    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },

    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "@tanstack/query": tanstackQuery,
    },

    rules: {
      // Base JS + TS rules
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended[0].rules,

      // TanStack Query recommended rules (FIX)
      ...tanstackQuery.configs.recommended.rules,

      // React rules
      ...reactHooks.configs.recommended.rules,

      // Custom overrides
      "@typescript-eslint/no-explicit-any": "off",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  }
);
