import { Box, Image, Group, Table, Text, Button } from '@mantine/core';
import { Link, useFetcher, useSearchParams } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { CastWithAges } from '~/utils/api.server';
import { baseImageUrl, LIMIT } from '~/utils/constants';
import { loader } from '~/routes/movie.$id.cast';

interface ProfileImageProps {
  id: number;
  src: string;
  alt: string;
}

function ProfileImage({ id, src, alt }: ProfileImageProps) {
  return (
    <Box component={Link} to={`/person/${id}`} style={{ width: '85px' }}>
      <Image
        loading="lazy"
        src={src ? `${baseImageUrl}/${src}` : '/profileFallback.svg'}
        radius={4}
        alt={alt}
      />
    </Box>
  );
}

interface PersonsProps {
  initialCast: CastWithAges;
  releaseDate: string;
}

export function Persons({ initialCast, releaseDate }: PersonsProps) {
  const [persons, setPersons] = useState(initialCast);
  const fetcher = useFetcher<typeof loader>();
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    setPersons(initialCast);
  }, [initialCast]);

  useEffect(() => {
    if (!fetcher.data || fetcher.state === 'loading') {
      return;
    }

    if (fetcher.data) {
      const newItems = fetcher.data.cast;
      //TODO: FIX TS
      setPersons(prevAssets => [...prevAssets, ...newItems]);
    }
  }, [fetcher.data, fetcher.state]);

  function loadMore() {
    const offset = fetcher.data ? +fetcher.data?.offset + LIMIT : LIMIT;

    const newParams = new URLSearchParams();
    newParams.set('offset', offset.toString());
    newParams.set('releaseDate', releaseDate);

    setSearchParams(newParams, { replace: true, preventScrollReset: true });
    fetcher.load(`cast?${newParams.toString()}`);
  }

  const isDone = fetcher?.data?.done ? fetcher?.data.done : false;
  return (
    <>
      <Table className="table-sm" id="persons">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Actor</Table.Th>
            <Table.Th>Age then</Table.Th>
            <Table.Th>Age now</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {persons.map(
            ({
              id,
              name,
              character,
              birthday,
              deathday,
              ageNow,
              ageThen,
              profile_path,
            }) => {
              return (
                <Table.Tr key={id}>
                  <Table.Td>
                    <Group wrap="nowrap">
                      <ProfileImage id={id} src={profile_path} alt={name} />
                      <Box>
                        <Text fw="700">{name}</Text>
                        <Text>{character}</Text>
                        <Text>Birthday: {birthday ? birthday : '-'}</Text>
                      </Box>
                    </Group>
                  </Table.Td>
                  <Table.Td>{ageThen ? ageThen : '-'}</Table.Td>
                  <Table.Td>
                    {deathday
                      ? ` ${deathday} (${ageNow})`
                      : ageNow
                        ? ageNow
                        : '-'}
                  </Table.Td>
                </Table.Tr>
              );
            },
          )}
        </Table.Tbody>
      </Table>

      {!isDone && (
        <Button
          loading={fetcher.state === 'loading'}
          variant="default"
          m={'sm'}
          size="sm"
          onClick={loadMore}
        >
          load more
        </Button>
      )}
    </>
  );
}
