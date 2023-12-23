import { render, screen } from '@/test/test-utils';

import Person from '@/components/Persons/Person/Person';

const Wrapper = ({ children }) => {
  return (
    <table>
      <tbody>{children}</tbody>
    </table>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: Wrapper, ...options });

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

    customRender(<Person person={person} />);

    expect(screen.getByText(name)).toBeInTheDocument();
    expect(screen.getByText(character)).toBeInTheDocument();
    expect(screen.getByText(/birthday/i)).toHaveTextContent(birthday);
    expect(screen.getByText(age)).toBeInTheDocument();
    expect(screen.getByText(ageOnRelease)).toHaveTextContent(ageOnRelease);
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

    const { deathday, age } = person;
    customRender(<Person person={person} />);

    expect(screen.getByText(`${deathday} (${age})`)).toHaveTextContent(
      deathday,
    );
  });
});
