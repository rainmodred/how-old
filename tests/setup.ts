import { expect, afterEach, vi, beforeAll, afterAll } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import { server } from './mocks/node';
import { db, seed } from './mocks/db';
import { drop } from '@mswjs/data';

// NOTE: server.listen must be called before `createClient` is used to ensure
// the msw can inject its version of `fetch` to intercept the requests./
//don't work inside beforeAll
server.listen();
beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  drop(db);
  seed();
});
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => server.close());

beforeAll(() => {
  server.listen();
});
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => server.close());

// server.events.on('request:start', ({ request }) => {
//   console.log('MSW intercepted:', request.method, request.url);
// });

expect.extend(matchers);

window.HTMLElement.prototype.scrollIntoView = function () {};

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

class IntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserver,
});

Object.defineProperty(global, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserver,
});
