import React, { ReactElement } from 'react'
import { useParams , Link } from 'react-router-dom'
import { Skeleton, Flex, Heading, SimpleGrid, Box } from '@chakra-ui/core'
import useJqlQuery from '../../hooks/useJqlQuery'
import { Puzzle, Algset } from '../../generated/jql'
import CubingIcon from '../../components/CubingIcon/CubingIcon'
import Paginator from '../../components/Paginator/Paginator'
import TransparentTwisty from '../../components/TwistyPlayers/Transparent'
import { activityKey } from '../../constants/events'

import { VISUALIZATION } from '../../constants/jql'

const AlgsetList = ({ algsets }: { algsets: Algset[] }) => (
  <SimpleGrid
    columns={{ base: 1, md: 2, xl: 3 }}
    spacing={2}
    mt={4}
    mx={4}
    pb={4}
  >
    {algsets.map((algset) => (
      <Flex
        as={Link}
        p={5}
        shadow="md"
        borderWidth="1px"
        borderRadius="md"
        to={`/puzzle/${algset.puzzle.code}/algsets/${algset.code}`}
        alignContent="center"
        justify="center"
        direction="column"
      >
        <Heading
          _hover={{ textDecoration: 'underline' }}
          fontSize="xl"
          textAlign="center"
        >
          {algset.name}
        </Heading>
        <Box
          as={TransparentTwisty}
          puzzle={algset.puzzle.name as any}
          controls="none"
          pointerEvents="none"
          m="auto"
          // @ts-ignore
          visualization={VISUALIZATION[algset.visualization]}
        />
      </Flex>
    ))}
  </SimpleGrid>
)

export default function PuzzlePage(): ReactElement {
  const { puzzleId } = useParams<{ puzzleId: string }>()

  const query = React.useMemo(
    () => ({
      name: null,
      id: null,
      code: null,
      algsets: {
        paginatorInfo: {
          total: null,
          count: null,
        },
        data: {
          name: null,
          mask: null,
          visualization: null,
          code: null,
          puzzle: {
            name: null,
            code: null,
          },
        },
        __args: {
          is_public: true,
        },
      },
      __args: {
        is_public: true,
        code: puzzleId,
      },
    }),
    [puzzleId],
  )

  const { isLoading, data, error } = useJqlQuery<Puzzle, Error>(
    `${puzzleId}-get`,  
    'getPuzzle',
    query,
  )

  if (!data || isLoading) return <Skeleton />
  if (error) return <div>{error.message}</div>
  return (
    <Flex direction="column" justify="center" align="center">
      <Flex direction="row" align="center" justify="center">
        <CubingIcon event={data.code} fontSize="4em" mr={2} />
        <Heading fontSize="3em" textAlign="center">
          {data.name}
        </Heading>
      </Flex>
      <AlgsetList algsets={data.algsets.data as Algset[]} />
      <Paginator />
    </Flex>
  )
}
