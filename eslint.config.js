module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    "standard-with-typescript",
    "@nuxtjs/eslint-config-typescript",
  ],
  overrides: [],
  parser: "vue-eslint-parser",
  parserOptions: {
    project: ["./tsconfig.json"],
    ecmaVersion: "latest",
    sourceType: "module",
    extraFileExtensions: [".vue"],
  },
  plugins: ["vue"],
  rules: {
    "vue/multi-word-component-names": "off",
  },
};
