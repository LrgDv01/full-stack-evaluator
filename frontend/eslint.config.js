import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config' // Import: For modern ESLint flat config

export default defineConfig([
  // Ignores: Skip dist for build artifacts
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      // Extends: Recommended JS, React hooks, Vite refresh for best practices
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      // Globals: Browser for React/Vite env
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // Rule: Ignore unused vars starting with caps/underscore for example like (React components)
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])
