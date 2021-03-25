module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["test-future"],
  testMatch: ["**/*.test.ts"],
  cacheDirectory: "build/jest-cache",
  automock: false,
}
