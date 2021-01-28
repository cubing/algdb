import React, { ReactElement } from 'react'
import { Skeleton, Box, Heading, SimpleGrid, Flex } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import useJqlQuery from '../../hooks/useJqlQuery'
import { Query } from '../../generated/schema'
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
    code: null,
  },
  __args: {
    is_public: true,
  },
}
// this is temporary until we are able to get puzzle support from TwistyPlayer
const puzzleIDs = [
  '3x3x3',
  'custom',
  '2x2x2',
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
      <SimpleGrid
        columns={{ base: 1, md: 2, xl: 3 }}
        spacing={2}
        mt={4}
        mx={4}
        pb={4}
      >
        {data?.data.map((puzzle) => (
          <PuzzleView
            key={puzzle!.id}
            id={puzzle!.id}
            code={puzzle!.code}
            name={puzzle!.name}
          />
        ))}
      </SimpleGrid>
    </Skeleton>
  )
}

const PuzzleView = ({
  id,
  name,
  code,
}: {
  id: string
  name: string
  code: string
}): ReactElement => {
  return (
    <Flex
      as={Link}
      p={5}
      shadow="md"
      borderWidth="1px"
      borderRadius="md"
      to={`/puzzle/${code}`}
      alignContent="center"
      justify="center"
      direction="column"
    >
      <Heading
        _hover={{ textDecoration: 'underline' }}
        fontSize="xl"
        textAlign="center"
      >
        {name}
      </Heading>
      {puzzleIDs.includes(name.toLowerCase()) ? (
        <Box
          as={TransparentTwisty}
          puzzle={name.toLowerCase() as any}
          controls="none"
          pointerEvents="none"
          m="auto"
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
}
