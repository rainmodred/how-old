import { Flex, Text, Box, Tr, Td } from '@chakra-ui/react';
import NextImage from 'next/image';
import profileFallback from '../../public/profileFallback.svg';

export const ChakraNextImage = props => {
  const { src, alt, ...rest } = props;
  return (
    <Box position="relative" {...rest}>
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
    <Tr>
      <Td>
        <Flex alignItems="center" gridGap="2">
          <ChakraNextImage
            h={{ base: '103px', md: '120px' }}
            w={{ base: '30px', md: '72px' }}
            minW="62px"
            src={imgSrc}
            alt={`${name} image`}
            borderRadius="10px"
            overflow="hidden"
          ></ChakraNextImage>
          <Box>
            <Text whiteSpace={['wrap', 'nowrap']} fontWeight="bold">
              {name}
            </Text>
            <Text>{character}</Text>
            <Text>Birthday: {birthday}</Text>
          </Box>
        </Flex>
      </Td>
      <Td isNumeric>{ageOnRelease}</Td>
      <Td isNumeric textAlign="center">
        <Text>{deathday ? ` ${deathday} (${age})` : age}</Text>
      </Td>
    </Tr>
  );
}
