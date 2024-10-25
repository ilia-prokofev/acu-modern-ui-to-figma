/** @type {import('ts-jest').JestConfigWithTsJest} **/
const { Config } = require('@jest/types');

// Sync object
const config = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testRunner: "jest-circus/runner"
};

module.exports = config;