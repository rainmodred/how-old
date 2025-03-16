import { reactRouter } from '@react-router/dev/vite';
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { configDefaults } from 'vitest/config';
import { reactRouterDevTools } from 'react-router-devtools';

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    // reactRouterDevTools(),
    !process.env.VITEST && reactRouter(),
    tsconfigPaths(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    exclude: [...configDefaults.exclude, 'e2e/*'],
    env: loadEnv('', process.cwd(), ''),
  },
});
