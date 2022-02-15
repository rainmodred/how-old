// import { getPage } from 'next-page-tester';
// import { screen, waitForElementToBeRemoved } from '@testing-library/react';
// import { rest } from 'msw';
// import { server } from '@/mocks/server';
// import { mockedApiMovie } from '@/mocks/mocks';

// // eslint-disable-next-line
// jest.mock('next/image', () => () => <></>);

// const AVENGERS = {
//   id: 24428,
//   releaseDate: '2012-04-25',
//   title: 'The Avengers',
// };

// const { id, releaseDate, title } = AVENGERS;

describe('Movie page', () => {
  it.skip('renders page with cast', async () => {
    // const { render } = await getPage({
    //   route: `/movie/${id}?releaseDate=${releaseDate}&title=${title}`,
    // });
    // render();
    // expect(screen.getByText(/avengers/i)).toBeInTheDocument();
    // await waitForElementToBeRemoved(() => screen.queryByText('Loading...'));
    // expect(screen.getAllByRole('row')).toHaveLength(mockedApiMovie.length + 1);
  });

  it.skip('renders error message when receive an error from api', async () => {
    // server.use(
    //   rest.get('/api/movie/:id/', (_req, res, ctx) =>
    //     res.once(ctx.status(404), ctx.json({ error: 'Error' })),
    //   ),
    // );
    // const { render } = await getPage({
    //   route: `/movie/1?releaseDate=${releaseDate}&title=${title}`,
    // });
    // render();
    // await waitForElementToBeRemoved(() => screen.queryByText('Loading...'));
    // expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});
