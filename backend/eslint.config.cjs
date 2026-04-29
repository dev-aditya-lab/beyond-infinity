// Bridge legacy .eslintrc.json rules into ESLint flat config for v9+/v10
const eslintrc = require("./.eslintrc.json");

module.exports = [
  {
    ignores: ["node_modules/**", "dist/**", ".env"]
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: eslintrc.parserOptions?.ecmaVersion || 2022,
      sourceType: eslintrc.parserOptions?.sourceType || 'module'
    },
    rules: eslintrc.rules || {},
    plugins: {
      // require will resolve the installed plugin package
      prettier: require('eslint-plugin-prettier')
    }
  }
];
