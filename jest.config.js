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
    '^@/test/(.*)$': '<rootDir>/src/test/$1',
  },
};

module.exports = createJestConfig(customJestConfig);
