import { useState } from 'react';
import {
  InputRightElement,
  InputGroup,
  List,
  ListItem,
  Text,
  Input,
  Flex,
  Spinner,
  Heading,
  InputLeftElement,
  Box,
} from '@chakra-ui/react';
import { SearchIcon, CloseIcon } from '@chakra-ui/icons';
import router from 'next/router';
import { useCombobox } from 'downshift';
import { useDebouncedCallback } from 'use-debounce';

import { useSearchMulti } from '@/hooks/swr';

function itemToString(item) {
  if (item.media_type === 'movie') {
    return `${item.title} (${item?.release_date?.slice(0, 4)})`;
  }

  if (item.media_type === 'tv') {
    return `${item.name} (${item?.first_air_date?.slice(0, 4)})`;
  }

  throw new Error('Unexpected item');
}

const flattenGroupOptions = options =>
  options.reduce((prev, curr) => {
    return [...prev, ...curr.items];
  }, []);

export default function Search() {
  const [inputValue, setInputValue] = useState('');
  const { data, isLoading: isFetching, error } = useSearchMulti(inputValue);
  const [queried, setQueried] = useState(false);

  const debounce = useDebouncedCallback(value => {
    setInputValue(value);
  }, 500);

  const {
    isOpen,
    closeMenu,
    openMenu,
    getComboboxProps,
    getInputProps,
    getMenuProps,
    getItemProps,
    highlightedIndex,
    selectItem,
  } = useCombobox({
    id: 'Search',
    items: data ? flattenGroupOptions(data) : [],
    itemToString: item =>
      item.media_type === 'movie' ? item.title : item.name,

    onInputValueChange: ({ inputValue }) => {
      if (inputValue !== '' && !queried) {
        setQueried(true);
      }

      debounce(inputValue);
    },

    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem.media_type === 'movie') {
        router.push(`/movie/${selectedItem.id}`);
      }

      if (selectedItem.media_type === 'tv') {
        router.push(`/tv/${selectedItem.id}`);
      }
    },
  });

  function handleReset() {
    closeMenu();
    setInputValue('');
    setQueried(false);
    selectItem(null);
  }

  const isLoading = queried && isFetching;

  function renderSuggestions() {
    if (isOpen) {
      if (error) {
        console.error(error);
        return (
          <Box>
            <Text
              size="md"
              textAlign="center
        "
              fontWeight="bold"
              color="gray.500"
              textTransform="uppercase"
            >
              Something went wrong.
            </Text>
          </Box>
        );
      }

      if (data?.length === 0) {
        return (
          <Box>
            <Text
              size="md"
              textAlign="center
            "
              fontWeight="bold"
              color="gray.500"
              textTransform="uppercase"
            >
              Not found
            </Text>
          </Box>
        );
      }

      if (data) {
        return (
          <>
            {
              data.reduce(
                (result, section, sectionIndex) => {
                  result.sections.push(
                    <Box key={sectionIndex}>
                      <Heading p="10px" size="md">
                        {section.title}
                      </Heading>
                      {section.items.map(item => {
                        const index = result.itemIndex++;

                        return (
                          <ListItem
                            key={item.id}
                            cursor="pointer"
                            backgroundColor={
                              highlightedIndex === index ? 'teal.400' : ''
                            }
                            borderRadius="5px"
                            p="10px"
                            {...getItemProps({ item, index })}
                          >
                            {itemToString(item)}
                          </ListItem>
                        );
                      })}
                    </Box>,
                  );
                  return result;
                },
                {
                  sections: [],
                  itemIndex: 0,
                },
              ).sections
            }
          </>
        );
      }
    }
  }

  return (
    <Flex flexDir="column" alignItems="center" position="relative" w="500px">
      <Flex width="100%" minW="400px" {...getComboboxProps()}>
        <InputGroup>
          <InputLeftElement>
            {isLoading ? <Spinner /> : <SearchIcon color="green.500" />}
          </InputLeftElement>
          <Input
            {...getInputProps({ onFocus: openMenu })}
            placeholder="Search for a movie or tv show"
          />
          {inputValue !== '' && (
            <InputRightElement onClick={handleReset} cursor="pointer">
              <CloseIcon color="teal.100" />
            </InputRightElement>
          )}
        </InputGroup>
      </Flex>
      <List
        position="absolute"
        top="0"
        mt="50px"
        z-index="1"
        w="100%"
        overflowY="auto"
        p="5"
        bg="white"
        boxShadow="0 4px 6px hsl(225deg 6% 13% / 28%)"
        borderRadius="10px"
        display={isOpen && data ? null : 'none'}
        {...getMenuProps()}
      >
        {renderSuggestions()}
      </List>
    </Flex>
  );
}
