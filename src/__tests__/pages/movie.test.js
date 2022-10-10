import { rest } from 'msw';

import { server } from '@/mocks/server';
import { mockedApiMovie } from '@/mocks/mocks';
import { render, screen, waitForElementToBeRemoved } from '@/test/test-utils';
import Movie from '@/pages/movie/[id]';

const AVENGERS = {
  id: 24428,
  releaseDate: '2012-04-25',
  title: 'The Avengers',
};

const { id, releaseDate, title } = AVENGERS;

describe('Movie page', () => {
  it('renders page with cast', async () => {
    render(<Movie />, { router: { query: { title, releaseDate, id } } });

    expect(screen.getByText(/avengers/i)).toBeInTheDocument();
    await waitForElementToBeRemoved(screen.queryAllByTestId('skeleton')[0]);

    expect(screen.getAllByRole('row')).toHaveLength(
      mockedApiMovie[id].length + 1,
    );
  });

  it('renders error message when receive an error from api', async () => {
    server.use(
      rest.get('/api/movie/:id/', (_req, res, ctx) =>
        res.once(ctx.status(404), ctx.json({ error: 'Error' })),
      ),
    );

    const invalidId = 1;
    render(<Movie />, {
      router: { query: { title, releaseDate, id: invalidId } },
    });
    await waitForElementToBeRemoved(screen.queryAllByTestId('skeleton')[0]);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});
