import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/router';
import { rest } from 'msw';

import { fetcher } from '@/utils/api';
import { SWRConfig } from 'swr';
import Search from '@/components/Search';
import { server } from '../../mocks/server';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('Search', () => {
  const push = jest.fn();
  useRouter.mockImplementation(() => ({
    push,
    pathname: '/',
    route: '/',
    asPath: '/',
    query: '',
  }));

  const placeholderText = 'Search for a movie or tv show';

  it('renders input', () => {
    render(<Search />);

    expect(screen.getByPlaceholderText(placeholderText)).toBeInTheDocument();
  });

  it('renders options', async () => {
    render(
      <SWRConfig
        value={{
          revalidateOnFocus: false,
          errorRetryCount: 1,
          dedupingInterval: 0,
          fetcher,
        }}
      >
        <Search />
      </SWRConfig>,
    );

    const input = screen.getByPlaceholderText(placeholderText);
    fireEvent.change(input, { target: { value: 'lost' } });

    expect(await screen.findByText('TV Shows')).toBeInTheDocument();
    expect(screen.getByText('Movies')).toBeInTheDocument();
    expect(screen.getByText('Lost (2004)')).toBeInTheDocument();
    expect(screen.getByText('Lost in Space (1998)')).toBeInTheDocument();
  });

  it('renders spinner on loading', async () => {
    render(
      <SWRConfig
        value={{
          revalidateOnFocus: false,
          errorRetryCount: 1,
          dedupingInterval: 0,
          fetcher,
        }}
      >
        <Search />
      </SWRConfig>,
    );

    const input = screen.getByPlaceholderText(placeholderText);
    fireEvent.change(input, { target: { value: 'lost' } });

    expect(await screen.findByText('Loading...')).toBeInTheDocument();
  });

  it('redirect on select', async () => {
    render(
      <SWRConfig
        value={{
          revalidateOnFocus: false,
          errorRetryCount: 1,
          dedupingInterval: 0,
          fetcher,
        }}
      >
        <Search />
      </SWRConfig>,
    );

    const input = screen.getByPlaceholderText(placeholderText);
    fireEvent.change(input, { target: { value: 'lost' } });
    const option = await screen.findByText('Lost (2004)');
    fireEvent.click(option);

    expect(push).toBeCalledWith('/tv/4607?season=1&title=Lost');
    expect(push).toBeCalledTimes(1);
  });

  it('shows Not found', async () => {
    server.use(
      rest.get('/api/search/multi', (_req, res, ctx) => {
        return res(ctx.json({ results: [] }));
      }),
    );
    render(
      <SWRConfig
        value={{
          revalidateOnFocus: false,
          errorRetryCount: 1,
          dedupingInterval: 0,
          fetcher,
        }}
      >
        <Search />
      </SWRConfig>,
    );

    const input = screen.getByPlaceholderText(placeholderText);
    fireEvent.change(input, { target: { value: 'lost' } });

    expect(await screen.findByText('Not found')).toBeInTheDocument();
  });
});
