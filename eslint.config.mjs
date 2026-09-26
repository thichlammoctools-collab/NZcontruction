import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

export default [
  {
    ignores: [".next/**", ".open-next/**", ".kilo/**", "node_modules/**"],
  },
  ...compat.extends("next/core-web-vitals").map((config) => ({
    ...config,
    rules: {
      ...config.rules,
      "react/no-unescaped-entities": "warn",
    },
  })),
];
