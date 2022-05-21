/* eslint-env node */
module.exports = {
  root: true,
  env: {
    node: true,
    "vue/setup-compiler-macros": true,
  },
  extends: [
    "plugin:vue/vue3-recommended",
    "plugin:promise/recommended",
    "eslint:recommended",
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'comma-dangle': ['error', 'always-multiline'],
    'vue/component-name-in-template-casing': ['error', 'kebab-case'],
    'vue/script-setup-uses-vars': 'error',
    'vue/max-attributes-per-line': 'off',
    'import/no-unresolved': 'off',
    'vue/no-v-html': 'off',
    'padded-blocks': ['warn', 'never', { allowSingleLineBlocks: true }],
  },
}
