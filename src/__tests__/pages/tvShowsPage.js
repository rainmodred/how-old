import { getPage } from 'next-page-tester';
import { screen, waitFor } from '@testing-library/react';

import { mockedApiTvShow } from '@/mocks/mocks';

// eslint-disable-next-line
jest.mock('next/image', () => () => <></>);

describe('Tv Show page', () => {
  it('renders page with cast', async () => {
    const id = 1668;
    const season = 1;
    const title = 'Friends';

    const { render } = await getPage({
      route: `/tv/${id}?season=${season}&title=${title}`,
    });

    render();
    expect(screen.getByText(/friends/i)).toBeInTheDocument();

    await waitFor(() => expect(screen.queryByText('Loading...')).toBeNull());

    expect(screen.getAllByTestId('name')).toHaveLength(mockedApiTvShow.length);
  });
});
