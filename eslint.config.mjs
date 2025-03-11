// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'node_modules/', // Ignore dependencies
      'dist/', // Ignore build output
      'coverage/', // Ignore test coverage reports
      '*.config.js', // Ignore config files
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 5,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      // 🔹 Best Practices
      'no-console': 'warn', // Warn on console.log (use logger instead)
      'no-debugger': 'error', // Disallow debugger statements
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Ignore unused function arguments with `_`

      // 🔹 TypeScript-Specific Rules
      '@typescript-eslint/no-explicit-any': 'error', // Disallow `any`
      '@typescript-eslint/no-floating-promises': 'error', // Prevent unhandled promises
      '@typescript-eslint/no-unsafe-argument': 'error', // Ensure safe argument usage
      '@typescript-eslint/explicit-function-return-type': 'warn', // Enforce return types for functions
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Ignore unused params with `_`

      // 🔹 Code Formatting (Handled by Prettier)
      'prettier/prettier': [
        'error',
        {
          singleQuote: true, // Enforce single quotes
          trailingComma: 'all', // Enforce trailing commas where valid
          printWidth: 100, // Wrap lines at 100 characters
          tabWidth: 2, // Use 2 spaces for indentation
          semi: true, // Require semicolons
        },
      ],
    },
  },
);
