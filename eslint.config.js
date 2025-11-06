import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { react: pluginReact },
    extends: [js.configs.recommended, pluginReact.configs.flat.recommended],
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react/prop-types": "off",
      "no-unused-vars": "warn",
      indent: ["error", 2],
      quotes: ["error", "double"],
      semi: ["error", "always"],
      "comma-dangle": ["error", "always-multiline"],
      "object-curly-spacing": ["error", "always"],
      "react/jsx-max-props-per-line": ["error", { maximum: 1 }],
      "react/jsx-first-prop-new-line": ["error", "multiline"],
      "react/jsx-closing-bracket-location": [1, "line-aligned"],
    },
    settings: {
      react: { version: "detect" },
    },
  },
]);
