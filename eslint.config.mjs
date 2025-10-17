import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      ".turbo/**",
      "dist/**",
      "build/**",
      "next-env.d.ts",
      "scripts/**",
    ],
  },
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "plugin:prettier/recommended",
    // "plugin:tailwindcss/recommended"
  ),
  {
    rules: {
      "no-undef": "off",
      camelcase: "off",
    },
  },
];

export default eslintConfig;
