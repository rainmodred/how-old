import { render, screen } from '@testing-library/react';

import Persons from '@/components/Persons';
import { mockedApiMovie } from '@/mocks/mocks';

// eslint-disable-next-line
jest.mock('next/image', () => () => <></>);

describe('Persons', () => {
  it('renders persons', () => {
    render(<Persons persons={mockedApiMovie} />);

    expect(screen.getAllByRole('row')).toHaveLength(mockedApiMovie.length + 1);
  });
});
