import { render, screen } from '@testing-library/react';

import Persons from '@/components/Persons';
import { mockedApiMovie } from '@/mocks/mocks';

const persons = mockedApiMovie[24428];
// eslint-disable-next-line
jest.mock('next/image', () => () => <></>);

describe('Persons', () => {
  it('renders persons', () => {
    render(<Persons persons={persons} />);

    expect(screen.getAllByRole('row')).toHaveLength(persons.length + 1);
  });
});
