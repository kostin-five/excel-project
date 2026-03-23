const js = require("@eslint/js");
const babelParser = require("@babel/eslint-parser");
const globals = require("globals");

module.exports = [
  // Базовые рекомендованные правила ESLint
  js.configs.recommended,

  {
    languageOptions: {
      // Подключаем парсер Babel
      parser: babelParser,
      parserOptions: {
        requireConfigFile: true,
        babelOptions: {
          configFile: "./babel.config.json",
        },
      },
      // Глобальные переменные для браузера и Node.js
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    // Ваши пользовательские правила
    rules: {
      // Можно добавлять свои правила, например:
      // "no-console": "warn",
    },
  },
];
