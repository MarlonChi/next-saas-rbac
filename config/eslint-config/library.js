/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["eslint:recommended", "prettier", "turbo"],
  plugins: ["only-warn", "simple-import-sort"],
  rules: {
    "simple-import-sort/imports": "error",
  },
};
