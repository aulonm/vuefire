/** @type {jest.Parameters} */
module.exports = {
  preset: 'ts-jest',
  collectCoverage: true,
  moduleFileExtensions: ['js', 'json', 'ts'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coveragePathIgnorePatterns: ['/node_modules/', 'src/index.ts'],
  testMatch: ['<rootDir>/__tests__/**/*.spec.ts'],
  testEnvironment: './__tests__/custom-jest-environment.js',
  globals: {
    'ts-jest': {
      diagnostics: {
        warnOnly: true,
      },
    },
  },
  testURL: 'http://localhost/',
}
