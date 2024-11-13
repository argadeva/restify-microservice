module.exports = [
  {
    files: ["*.js", "src/**/*.js"],
    languageOptions: {
      ecmaVersion: 12,
      sourceType: "module",
    },
    plugins: {
      prettier: require("eslint-plugin-prettier"),
      node: require("eslint-plugin-node"),
    },
    rules: {
      "prettier/prettier": "error",
      "no-console": "warn",
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "node/no-unpublished-require": "off",
      "node/no-missing-require": "off",
      "no-console": "off",
    },
  },
  {
    files: ["*.js"],
    ignores: ["node_modules/**"],
  },
];
