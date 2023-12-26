import {
  Image,
  Text,
  Title,
  Center,
  Loader,
  Table,
  Group,
  Box,
} from '@mantine/core';
import { redirect, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { differenceInYears } from 'date-fns';
import { getCast, getPerson } from '~/utils/api.server';
import { formatDate } from '~/utils/dates.server';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const releaseDate = url.searchParams.get('release_date');
  if (!params.id || !releaseDate) {
    throw redirect('/');
  }

  const cast = await getCast(params.id);
  const promises = cast
    .slice(0, 5)
    .map(actor => getPerson(actor.id, actor.character));

  const result = await Promise.all(promises);
  console.log({ result });

  const castWithAges = result.map(person => {
    const end = person.deathday ? new Date(person.deathday) : new Date();

    return {
      id: person.id,
      name: person.name,
      character: person.character,
      birthday: formatDate(person.birthday),
      deathday: formatDate(person.deathday),
      profile_path: person.profile_path,
      ageNow: differenceInYears(end, person.birthday),
      ageThen: differenceInYears(new Date(releaseDate), person.birthday),
    };
  });
  console.log({ castWithAges });

  return {
    cast: castWithAges,
    releaseDate,
    title: url.searchParams.get('title'),
  };
}

export default function MoviePage() {
  const { cast, releaseDate, title } = useLoaderData<typeof loader>();
  console.log({ cast });
  return (
    <>
      {title ? (
        <Title size="h1">
          {title} ({releaseDate?.slice(0, 4)})
        </Title>
      ) : (
        <Center>
          <Loader />
        </Center>
      )}

      <Table className="table-sm">
        <thead>
          <tr>
            <th>Actor</th>
            <th>Age then</th>
            <th>Age now</th>
          </tr>
        </thead>
        <tbody>
          {/* {isLoading
            ? Array.from({ length: 5 }).map((_, index) => (
                <PersonSkeleton key={index} />
              ))
            : persons?.map(person => (
                <Person key={person.id} person={person} />
              ))} */}

          {cast.map(
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
                    <Group>
                      <Image
                        src={
                          profile_path
                            ? `http://image.tmdb.org/t/p/w185${profile_path}`
                            : '/profileFallback.svg'
                        }
                        w={185}
                        alt={`${name} image`}
                      />
                      <Box>
                        <Text fw="700">{name}</Text>
                        <Text>{character}</Text>
                        <Text>Birthday: {birthday}</Text>
                      </Box>
                    </Group>
                  </Table.Td>
                  <Table.Td align="center">{ageThen}</Table.Td>
                  <Table.Td align="center">
                    {deathday ? ` ${deathday} (${ageNow})` : ageNow}
                  </Table.Td>
                </Table.Tr>
              );
            },
          )}
        </tbody>
      </Table>
    </>
  );
}
