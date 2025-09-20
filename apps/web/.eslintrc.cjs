const sharedConfig = require.resolve("@team-task-board/config-eslint");

module.exports = {
  extends: ["next/core-web-vitals", sharedConfig],
  parserOptions: {
    project: "./tsconfig.json"
  },
  settings: {
    next: {
      rootDir: ["."]
    }
  }
};
