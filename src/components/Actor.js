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

export default function Actor() {
  return (
    <Box
      p="2"
      h="140px"
      w="100%"
      border="2px solid"
      borderColor="gray.200"
      borderRadius="10px"
    ></Box>
  );
}
