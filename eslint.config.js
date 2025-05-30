// eslint.config.js
import js from '@eslint/js'
import globals from 'globals'
import vue from 'eslint-plugin-vue'
import prettierPlugin from 'eslint-plugin-prettier'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: require.resolve('vue-eslint-parser'), // 👈 parse Vue SFCs
      parserOptions: {
        parser: require.resolve('@babel/eslint-parser'), // 👈 parse script block inside SFC
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      vue,
      prettier: prettierPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...vue.configs['flat/recommended'].rules,
      'vue/multi-word-component-names': 'off',
      'prettier/prettier': 'warn',
    },
  },
  {
    files: ['**/*.{js,ts}'], // JS/TS files only
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      'prettier/prettier': 'warn',
    },
  },
])
