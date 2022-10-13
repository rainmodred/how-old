import {
  render,
  screen,
  fireEvent,
  waitForElementToBeRemoved,
  userEvent,
} from '@/test/test-utils';

import Search from '@/components/Search/Search';

describe('Search', () => {
  const push = jest.fn();
  const placeholderText = 'Search for a movie or tv show';
  const query = 'Av';

  it('renders input', () => {
    render(<Search />);

    expect(screen.getByPlaceholderText(placeholderText)).toBeInTheDocument();
  });

  it('renders options', async () => {
    render(<Search />, { router: { push } });

    const input = screen.getByPlaceholderText(placeholderText);
    fireEvent.change(input, { target: { value: query } });

    expect(input).toHaveValue('Av');

    await waitForElementToBeRemoved(() => screen.queryByRole('presentation'));

    expect(await screen.findByText('Movies')).toBeInTheDocument();
    expect(screen.getByText('The Avengers (2012)')).toBeInTheDocument();
  });

  it('renders spinner on loading', async () => {
    render(<Search />);

    const input = screen.getByPlaceholderText(placeholderText);
    fireEvent.change(input, { target: { value: query } });

    expect(await screen.findByRole('presentation')).toBeInTheDocument();
  });

  it('redirect on select', async () => {
    const push = jest.fn();
    render(<Search />, { router: { push } });
    const user = userEvent.setup();

    const input = screen.getByPlaceholderText(placeholderText);
    await user.type(input, 'Fr');
    const option = await screen.findByText('Friends (1994)');
    await user.click(option);

    expect(push).toHaveBeenCalledWith('/tv/1668?season=1&title=Friends');
    expect(push).toHaveBeenCalledTimes(1);
  });
});
