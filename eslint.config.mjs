import globals from 'globals'
import jsonPlugin from '@eslint/json'
import stylistic from '@stylistic/eslint-plugin'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    ignores: ['node_modules/**', 'dist/**'],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: globals.node,
    },
    plugins: {
      js: stylistic, 
    },
    rules: {
      'js/indent': ['error', 2],
      'js/linebreak-style': ['error', 'unix'],
      'js/quotes': ['error', 'single'],
      'js/semi': ['error', 'never'],
      "eqeqeq": "error",
      'no-trailing-spaces': 'error',
      'object-curly-spacing': [
        'error', 'always'
      ],
      'arrow-spacing': [
        'error', { 'before': true, 'after': true }
      ],
      'no-console':0
    },
  },
  {
    files: ['.eslintrc.{js,cjs}'],
    languageOptions: {
      sourceType: 'script',
      globals: globals.node,
    },
  },
  {
    files: ['**/*.json'],
    ignores: ['package.json', 'package-lock.json'], 
    plugins: {
      json: jsonPlugin,
    },
    rules: {
      // You can optionally add JSON-specific rules here:
      // 'json/*': 'error',
    },
  },
])
