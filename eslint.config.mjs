import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended, // Recommended ESLint rules
  tseslint.configs.recommendedTypeChecked, // Recommended TypeScript rules with type checking
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // 🔹 Code Style
      quotes: ["error", "single"], // Enforce single quotes
      indent: ["error", 4], // Enforce 4-space indentation

      // 🔹 TypeScript-Specific Rules
      "@typescript-eslint/explicit-function-return-type": "error", // Require explicit return types
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ], // Allow unused variables prefixed with '_'

      // 🔹 Security & Best Practices
      "no-eval": "error", // Disallow `eval`
      "@typescript-eslint/no-explicit-any": "warn", // Warn when using `any`
    },
  },
);
