import eslint from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import simpleImportSortPlugin from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";

const baseConfig = [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooksPlugin.configs.flat["recommended-latest"],
  {
    plugins: {
      react: reactPlugin,
      "simple-import-sort": simpleImportSortPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      // Your base rules
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
      ],
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "prettier/prettier": "error",
      "arrow-body-style": "off",
      "prefer-arrow-callback": "off",

      // Example React-specific rules you might want
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",

      "no-console": "error",
    },
    languageOptions: {
      // This is the new way to set the parser and parser options
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // Define global variables if needed, e.g., for browser or Node.js
        browser: true,
        es2021: true,
        node: true,
      },
    },
    settings: {
      react: {
        version: "detect", // Automatically detect the React version
      },
    },
  },
  {
    // Global ignores, these apply to all workspaces that extend this config
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "tailwind.config.js",
      "vite.config.ts",
    ],
  },
  prettierConfig,
];

export default baseConfig;
