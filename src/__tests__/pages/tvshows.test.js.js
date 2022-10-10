import { rest } from 'msw';

import { server } from '@/mocks/server';
import { mockedApiTvShow } from '@/mocks/mocks';
import {
  render,
  screen,
  waitForElementToBeRemoved,
  userEvent,
} from '@/test/test-utils';

import TvShow from '@/pages/tv/[id]';

const id = 1668;
const season = 1;
const title = 'Friends';

describe('Tv Show page', () => {
  it('renders page with cast', async () => {
    render(<TvShow />, { router: { query: { season, title, id } } });

    expect(screen.getByText(/friends/i)).toBeInTheDocument();

    await waitForElementToBeRemoved(screen.queryAllByTestId('skeleton')[0]);
    expect(screen.getAllByRole('row')).toHaveLength(
      mockedApiTvShow[id][season].length + 1,
    );
  });

  it('renders error message when receive an error from api', async () => {
    server.use(
      rest.get('/api/tv/:id/', (_req, res, ctx) =>
        res.once(ctx.status(404), ctx.json({ error: 'Error' })),
      ),
    );

    const invalidId = 1;
    render(<TvShow />, { router: { query: { season, title, id: invalidId } } });
    await waitForElementToBeRemoved(screen.queryAllByTestId('skeleton')[0]);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('season select changes route', async () => {
    const push = jest.fn();
    const user = userEvent.setup();
    render(<TvShow />, { router: { query: { season, title, id }, push } });
    await waitForElementToBeRemoved(screen.queryAllByTestId('skeleton')[0]);

    await user.click(screen.getByRole('searchbox'));
    await user.click(screen.getAllByRole('option')[1]);

    expect(push).toHaveBeenCalledWith(`/tv/${id}?season=${2}&title=${title}`);
  });
});
