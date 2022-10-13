import NextImage from 'next/image';
import { Box, Group, Text } from '@mantine/core';

import profileFallback from '/public/images/profileFallback.svg';

export const Image = props => {
  const { src, alt } = props;
  return (
    <Box
      sx={() => ({
        position: 'relative',
        height: '100px',
        width: '60px',
        borderRadius: '10px',
        overflow: 'hidden',
        flexShrink: 0,
      })}
    >
      <NextImage
        objectFit={src ? 'cover' : 'contain'}
        layout="fill"
        src={src ? src : profileFallback}
        alt={alt}
      />
    </Box>
  );
};

export default function Person({ person }) {
  const {
    name,
    character,
    birthday,
    deathday,
    age,
    ageOnRelease,
    profile_path,
  } = person;

  const imgSrc = profile_path
    ? `https://image.tmdb.org/t/p/w300${profile_path}`
    : null;

  return (
    <tr>
      <td>
        <Group noWrap>
          <Image src={imgSrc} alt={`${name} image`}></Image>
          <Box>
            <Text weight="bold">{name}</Text>
            <Text>{character}</Text>
            <Text>Birthday: {birthday}</Text>
          </Box>
        </Group>
      </td>
      <td>{ageOnRelease}</td>
      <td>{deathday ? ` ${deathday} (${age})` : age}</td>
    </tr>
  );
}
