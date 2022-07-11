/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

// module.exports = {
//   clearMocks: true,
//   collectCoverage: true,
//   collectCoverageFrom: [
//     'src/**/*.js',
//     '!src/mocks/**/*.js',
//     '!src/pages/**/*.js',
//   ],
//   coverageDirectory: 'coverage',
//   coverageProvider: 'v8',
//   testEnvironment: 'jsdom',
//   transform: {
//     '^.+\\.(js|jsx)$': 'babel-jest',
//     '.+\\.(svg)$': 'jest-transform-stub',
//   },
//   setupFiles: [require.resolve('whatwg-fetch')],
//   setupFilesAfterEnv: ['./setupTests.js'],
//   moduleNameMapper: {
//     '^@/components/(.*)$': '<rootDir>/src/components/$1',
//     '^@/pages/(.*)$': '<rootDir>/src/pages/$1',
//     '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
//     '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
//     '^@/mocks/(.*)$': '<rootDir>/src/mocks/$1',
//   },
// };

const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFiles: [require.resolve('whatwg-fetch')],
  setupFilesAfterEnv: ['./setupTests.js'],
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@/mocks/(.*)$': '<rootDir>/src/mocks/$1',
  },
};

module.exports = createJestConfig(customJestConfig);
