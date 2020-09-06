import React, { ReactElement } from 'react'
import { Skeleton, Box, Heading, SimpleGrid, Flex } from '@chakra-ui/core'
import { Link } from 'react-router-dom'
import useJqlQuery from '../../hooks/useJqlQuery'
import { Query } from '../../generated/jql'
import TransparentTwisty from '../../components/TwistyPlayers/Transparent'
import CubingIcon from '../../components/CubingIcon/CubingIcon'
import { activityKey } from '../../constants/events'

const query = {
  paginatorInfo: {
    count: null,
    total: null,
  },
  data: {
    id: null,
    name: null,
    created_at: null,
  },
}
// this is temporary until we are able to get puzzle support from TwistyPlayer
const puzzleIDs = [
  '3x3x3',
  'custom',
  '2x2xm2',
  '4x4x4',
  'megaminx',
  'pyraminx',
  'sq1',
  'clock',
  'skewb',
  'FTO',
]

export default function Puzzles(): ReactElement {
  const { isLoading, error, data } = useJqlQuery<Query['getMultiplePuzzle']>(
    'getAllPuzzles',
    'getMultiplePuzzle',
    query,
  )

  if (error) return <div>{`Error: ${error!.message}`}</div>

  return (
    <Skeleton isLoaded={!isLoading}>
      <SimpleGrid columns={{ sm: 1, md: 3 }} spacing={4} m={4}>
        {data?.data.map((puzzle) => (
          <PuzzleView key={puzzle!.id} id={puzzle!.name} name={puzzle!.name} />
        ))}
      </SimpleGrid>
    </Skeleton>
  )
}

const PuzzleView = ({
  id,
  name,
}: {
  id: string
  name: string
}): ReactElement => (
  <Flex
    as={Link}
    p={5}
    shadow="md"
    borderWidth="1px"
    borderRadius="md"
    to={`/puzzle/${id}`}
    alignContent="center"
    justify="center"
    direction="column"
  >
    <Heading fontSize="xl" align="center">
      {name}
    </Heading>
    {puzzleIDs.includes(id) ? (
      <Box
        as={TransparentTwisty}
        puzzle={id as any}
        controls="none"
        pointerEvents="none"
      />
    ) : (
      <CubingIcon
        event={activityKey[name] as string}
        fontSize="10vw"
        flex="1"
        textAlign="center"
      />
    )}
  </Flex>
)
