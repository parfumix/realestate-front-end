// eslint.config.js
import js from '@eslint/js'
import globals from 'globals'
import vue from 'eslint-plugin-vue'
import prettierPlugin from 'eslint-plugin-prettier'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    files: ['**/*.{js,ts,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
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
      'prettier/prettier': 'warn', // Run Prettier through ESLint
    },
  },
])
