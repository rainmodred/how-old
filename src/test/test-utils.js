import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { SWRConfig } from 'swr';

const mockRouter = {
  basePath: '',
  pathname: '/',
  route: '/',
  query: {},
  asPath: '/',
  back: jest.fn(),
  beforePopState: jest.fn(),
  prefetch: () => new Promise(resolve => resolve),
  push: jest.fn(),
  reload: jest.fn(),
  replace: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
  isLocaleDomain: false,
  isReady: true,
  defaultLocale: 'en',
  domainLocales: [],
  isPreview: false,
};

const AllTheProviders = ({ children, router }) => {
  return (
    <RouterContext.Provider value={{ ...mockRouter, ...router }}>
      <SWRConfig value={{ provider: () => new Map() }}>{children}</SWRConfig>
    </RouterContext.Provider>
  );
};

const customRender = (ui, options) => {
  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders router={options?.router}>{children}</AllTheProviders>
    ),
    ...options,
  });
};

export * from '@testing-library/react';
export { customRender as render, userEvent };
