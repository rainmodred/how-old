import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path, { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
  },
  // alias: [
  //   {
  //     // find: '@/test',
  //     // replacement: resolve(__dirname, './src/test/'),

  //   },
  // ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/'),
    },
  },
});

// moduleNameMapper: {
//   '^@/components/(.*)$': '<rootDir>/src/components/$1',
//   '^@/pages/(.*)$': '<rootDir>/src/pages/$1',
//   '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
//   '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
//   '^@/mocks/(.*)$': '<rootDir>/src/mocks/$1',
//   '^@/test/(.*)$': '<rootDir>/src/test/$1',
// },
