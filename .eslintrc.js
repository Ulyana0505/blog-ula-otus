module.exports = {
    env: {
      browser: true,
      es2021: true,
      "jest/globals": true,
    },
    extends: ["eslint:recommended", "prettier"],
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: ["jest"],
    rules: {},
    overrides: [
      {
        files: [
          ".eslintrc.js",
          "babel.config.js",
          "jest.config.js",
          "webpack.config.build.js",
          "webpack.config.dev.js",
        ],
        env: {
          node: true, // Apply Node environment specifically for ESLint config
        },
      },
    ],
  };
