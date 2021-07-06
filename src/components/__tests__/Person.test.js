import { render, screen } from '@testing-library/react';

import Person from '@/components/Person';

jest.mock('next/image', () => () => <></>);

describe('Person', () => {
  it('renders person', () => {
    const person = {
      id: 54693,
      name: 'Emma Stone',
      character: 'Olive Penderghast',
      birthday: '1988-11-06',
      profile_path: '/2hwXbPW2ffnXUe1Um0WXHG0cTwb.jpg',
      age: 32,
      ageOnRelease: 21,
    };
    const { name, character, age, ageOnRelease } = person;

    render(<Person person={person} />);

    expect(screen.getByTestId('name')).toHaveTextContent(
      `${name} / ${character}`,
    );
    expect(screen.getByText(`${age} years old`)).toBeInTheDocument();
    expect(screen.getByText(ageOnRelease)).toBeInTheDocument();
  });
});
