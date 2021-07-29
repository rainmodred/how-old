import { Flex, Text, Box } from '@chakra-ui/react';
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
    <Box p="1" w="100%" borderRadius="10px">
      <Flex alignItems="center">
        <ChakraNextImage
          h={{ base: '103px', md: '120px' }}
          w={{ base: '62px', md: '72px' }}
          minW="62px"
          src={imgSrc}
          alt={`${name} image`}
          borderRadius="10px"
          overflow="hidden"
        ></ChakraNextImage>
        <Box p="4">
          <Text
            whiteSpace={['wrap', 'nowrap']}
            fontWeight="bold"
            data-testid="name"
          >
            {name} / {character}
          </Text>
          <Text whiteSpace="nowrap" data-testid="birthday">
            <Text as="b">Born: </Text>
            {birthday}
          </Text>
          {deathday && (
            <Text whiteSpace="nowrap" data-testid="deathday">
              <Text as="b">Died: </Text>
              {deathday}
            </Text>
          )}

          <Text whiteSpace="nowrap" data-testid="age">
            <Text as="b">{age}</Text> years old
          </Text>
        </Box>
        <Box ml="auto">
          <Box
            p="15px"
            borderRadius="50%"
            bg="teal.400"
            color="white"
            fontWeight="bold"
            data-testid="ageOnRelease"
          >
            {ageOnRelease}
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
