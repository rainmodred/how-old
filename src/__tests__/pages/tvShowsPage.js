import { getPage } from 'next-page-tester';
import { screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { server } from '@/mocks/server';
import { mockedApiTvShow } from '@/mocks/mocks';

// eslint-disable-next-line
jest.mock('next/image', () => () => <></>);

const id = 1668;
const season = 1;
const title = 'Friends';

describe('Tv Show page', () => {
  it('renders page with cast', async () => {
    const { render } = await getPage({
      route: `/tv/${id}?season=${season}&title=${title}`,
    });

    render();
    expect(screen.getByText(/friends/i)).toBeInTheDocument();

    await waitFor(() => expect(screen.queryByText('Loading...')).toBeNull());

    expect(screen.getAllByTestId('name')).toHaveLength(mockedApiTvShow.length);
  });

  it('renders error message when receive an error from api', async () => {
    server.use(
      rest.get('/api/tv/:id/', (_req, res, ctx) =>
        res(ctx.status(404), ctx.json({ error: 'Error' })),
      ),
    );

    const { render } = await getPage({
      route: `/tv/1?season=${season}&title=${title}`,
    });

    render();
    await waitFor(() => expect(screen.queryByText('Loading...')).toBeNull());

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});
