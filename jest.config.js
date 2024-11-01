// jest.config.js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": "ts-jest", // Transforms TypeScript files using ts-jest
  },
  testMatch: ["**/src/test/**/*.test.ts"], // Updated to match src/test location
  moduleFileExtensions: ["ts", "js"], // Recognizes ts and js files
};
