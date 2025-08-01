import globals from 'globals'
import jsonPlugin from '@eslint/json'
import stylistic from '@stylistic/eslint-plugin'
import { defineConfig } from 'eslint/config'

export default defineConfig([
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
    plugins: {
      json: jsonPlugin,
    },
    language: 'json',
  },
])

