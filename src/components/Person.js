import { Flex, Text, Box } from '@chakra-ui/react';

import NextImage from 'next/image';

export const ChakraNextImage = props => {
  const { src, alt, ...rest } = props;
  return (
    <Box position="relative" {...rest}>
      <NextImage objectFit="cover" layout="fill" src={src} alt={alt} />
    </Box>
  );
};

export default function Person({ person }) {
  const { name, character, age, ageOnRelease, profile_path } = person;

  return (
    <Box
      p="2"
      h="140px"
      w="100%"
      border="2px solid"
      borderColor="gray.200"
      borderRadius="10px"
    >
      <Flex alignItems="center">
        <ChakraNextImage
          h={{ base: '103px', md: '120px' }}
          w={{ base: '62px', md: '72px' }}
          minW="62px"
          src={`https://image.tmdb.org/t/p/w300${profile_path}`}
          alt="meow"
          borderRadius="10px"
          overflow="hidden"
        ></ChakraNextImage>
        <Box p="4">
          <Text whiteSpace="nowrap" fontWeight="bold" data-testid="name">
            {name} / {character}
          </Text>
          <Text whiteSpace="nowrap">{age} years old</Text>
        </Box>
        <Box ml="auto">
          <Box
            p="15px"
            borderRadius="50%"
            bg="teal.400"
            color="white"
            fontWeight="bold"
          >
            {ageOnRelease}
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
