import { render, screen } from '@testing-library/react';

import Person from '@/components/Person';

// eslint-disable-next-line
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
    const { name, character, birthday, age, ageOnRelease } = person;

    render(<Person person={person} />);

    expect(screen.getByTestId('name')).toHaveTextContent(
      `${name} / ${character}`,
    );
    expect(screen.getByTestId('birthday')).toHaveTextContent(birthday);
    expect(screen.queryByTestId('deathday')).toBe(null);
    expect(screen.getByTestId('age')).toHaveTextContent(`${age} years old`);
    expect(screen.getByTestId('ageOnRelease')).toHaveTextContent(ageOnRelease);
  });

  it('shows death date', () => {
    const person = {
      id: 113,
      name: 'Christopher Lee',
      character: 'Saruman',
      birthday: '1922-05-27',
      deathday: '2015-06-07',
      profile_path: '/4zPu5YaRPbhrcp9aVjXQDjpfwPC.jpg',
      age: 93,
      ageOnRelease: 80,
    };

    const { deathday } = person;
    render(<Person person={person} />);

    expect(screen.getByTestId('deathday')).toHaveTextContent(deathday);
  });
});
