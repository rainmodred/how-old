import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { configDefaults } from 'vitest/config';

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    !process.env.VITEST &&
      remix({
        ignoredRouteFiles: ['**/*.css'],
      }),
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
