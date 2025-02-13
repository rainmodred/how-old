import { Box, Image, Group, Table, Text, Button } from '@mantine/core';
import { Link, useFetcher, useSearchParams } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { CastWithDates } from '~/utils/api.server';
import { baseImageUrl, LIMIT } from '~/utils/constants';
import { loader } from '~/routes/movie.$id.cast';
import { calculateAges } from '~/utils/dates';

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
  initialCast: CastWithDates;
  releaseDate: string;
  done: boolean;
}

export function Persons({ initialCast, releaseDate, done }: PersonsProps) {
  const [persons, setPersons] = useState(initialCast);
  const fetcher = useFetcher<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();

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
      setPersons(prev => [...prev, ...newItems]);
    }
  }, [fetcher.data, fetcher.state]);

  function loadMore() {
    const offset = searchParams.has('offset')
      ? Number(searchParams.get('offset')!) + LIMIT
      : LIMIT;

    const newParams = new URLSearchParams();
    newParams.set('offset', offset.toString());
    newParams.set('releaseDate', releaseDate);

    setSearchParams(newParams, { replace: true, preventScrollReset: true });
    fetcher.load(`cast?${newParams.toString()}`);
  }

  //Hide button if loaded all cast
  let isDone = false;
  if (done) {
    isDone = true;
  } else {
    isDone = fetcher?.data?.done ? fetcher?.data.done : false;
  }

  return (
    <>
      <Table className="table-sm" stickyHeader id="persons">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Actor</Table.Th>
            <Table.Th ta="center" style={{ whiteSpace: 'nowrap' }}>
              Age then
            </Table.Th>
            <Table.Th ta="center" style={{ whiteSpace: 'nowrap' }}>
              Age now
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {persons.map(
            ({ id, name, character, birthday, deathday, profile_path }) => {
              const { ageThen, ageNow } = calculateAges(releaseDate, {
                birthday,
                deathday,
              });

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
                  <Table.Td ta="center">{ageThen ? ageThen : '-'}</Table.Td>
                  <Table.Td ta="center">
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
          disabled={fetcher.state === 'loading'}
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
