const sharedConfig = require.resolve("@team-task-board/config-eslint");

module.exports = {
  extends: [sharedConfig],
  parserOptions: {
    project: "./tsconfig.json"
  },
  env: {
    node: true
  }
};
