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
  useColorMode,
} from '@chakra-ui/react';
import { SearchIcon, CloseIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { useCombobox } from 'downshift';

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

function stateReducer(_state, actionAndChanges) {
  const { type, changes } = actionAndChanges;

  switch (type) {
    case useCombobox.stateChangeTypes.InputKeyDownEnter:
    case useCombobox.stateChangeTypes.ItemClick:
      return {
        ...changes,
        inputValue: '',
      };
    default:
      return changes;
  }
}

export default function Search() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const { data, isLoading, error } = useSearchMulti(
    inputValue ? inputValue?.trim()?.toLowerCase() : '',
  );
  const { colorMode } = useColorMode();

  const {
    isOpen,
    openMenu,
    getComboboxProps,
    getInputProps,
    getMenuProps,
    getItemProps,
    highlightedIndex,
    reset,
  } = useCombobox({
    id: 'Search',
    items: data ? flattenGroupOptions(data) : [],
    stateReducer,
    itemToString: item => {
      if (item === null) {
        return;
      }

      return item.media_type === 'movie' ? item.title : item.name;
    },

    onInputValueChange: ({ inputValue }) => {
      setInputValue(inputValue);
    },

    onSelectedItemChange: ({ selectedItem }) => {
      const { media_type, id, release_date, title, name } = selectedItem;
      if (media_type === 'movie') {
        router.push(`/movie/${id}?releaseDate=${release_date}&title=${title}`);
      }

      if (media_type === 'tv') {
        // get seasons list?
        router.push(`/tv/${id}?season=1&title=${name}`);
      }
    },
  });

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
    <Flex
      flexDir="column"
      alignItems="center"
      position="relative"
      w="100%"
      maxW="564px"
    >
      <InputGroup w="100%" {...getComboboxProps()}>
        <InputLeftElement>
          {isLoading ? <Spinner /> : <SearchIcon color="green.500" />}
        </InputLeftElement>
        <Input
          {...getInputProps({ onFocus: openMenu })}
          placeholder="Search for a movie or tv show"
        />
        {inputValue !== '' && (
          <InputRightElement onClick={reset} cursor="pointer">
            <CloseIcon color="teal.100" />
          </InputRightElement>
        )}
      </InputGroup>

      <List
        position="absolute"
        top="0"
        mt="50px"
        zIndex="1"
        w="100%"
        overflowY="scroll"
        p="5"
        bg={colorMode === 'light' ? 'white' : 'gray.700'}
        boxShadow="0 4px 6px hsl(225deg 6% 13% / 28%)"
        borderRadius="10px"
        display={isOpen && (data || error) ? 'block' : 'none'}
        maxHeight="500px"
        {...getMenuProps()}
      >
        {renderSuggestions()}
      </List>
    </Flex>
  );
}
