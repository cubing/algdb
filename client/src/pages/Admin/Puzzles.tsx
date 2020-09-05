import React, { ReactElement, useState, ChangeEvent } from 'react'
import { Flex, Heading, Spinner, Input, Button } from '@chakra-ui/core'
import useJqlQuery from '../../hooks/useJqlQuery'
import useJqlMutation from '../../hooks/useJqlMutation'
import { Maybe, Puzzle, PuzzlePaginator } from '../../generated/jql'

type AddPuzzleProps = {
  onAdd: () => void
}

type AddPuzzleMutationArgs = {
  name: string
}

function AddPuzzle({ onAdd }: AddPuzzleProps): ReactElement {
  const [puzzleName, setPuzzleName] = useState<string>('')

  const [mutate, { isLoading, error }] = useJqlMutation<
    Maybe<Puzzle>,
    Error,
    AddPuzzleMutationArgs
  >('createPuzzle', {
    id: null,
    name: null,
  })

  const onClick = async () => {
    if (puzzleName) {
      try {
        await mutate({
          name: puzzleName
        })
        onAdd()
        setPuzzleName('')
      } catch (err) {
        console.error(err)
      }
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPuzzleName(event.target.value)
  }

  if (error) {
    console.error(error);
  }

  return (
    <tr>
      <td />
      <td>
        <Input placeholder="fto" value={puzzleName} onChange={handleChange} />
      </td>
      <td>
        <Button isLoading={isLoading} isDisabled={!puzzleName} onClick={onClick}>Add</Button>
      </td>
    </tr>
  )
}

const getPuzzlesQuery = {
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

export default function Puzzles(): ReactElement {
  const { isLoading, data, refetch, error } = useJqlQuery<PuzzlePaginator, Error>(
    'getMultiplePuzzle',
    'getMultiplePuzzle',
    getPuzzlesQuery,
  )

  const puzzles = data?.data || [];

  if (isLoading) {
    return <Spinner />
  }

  if (error) {
    console.error(error)
    return <>error</>
  }

  return (
    <Flex justify="center" align="center" direction="column">
      <Heading fontSize="4em" textAlign="center">
        Puzzles
      </Heading>
      <Flex w="80%" align="center" direction="column">
        <table width="100%">
          <thead>
            <tr>
              <th style={{textAlign: 'left'}}>ID</th>
              <th style={{textAlign: 'left'}}>Name</th>
              <th style={{textAlign: 'left'}}>Created</th>
            </tr>
          </thead>
          <tbody>
            {puzzles.map((puzzle) => puzzle ? (
              <tr key={puzzle.id}>
                <td>{puzzle.id}</td>
                <td>{puzzle.name}</td>
                <td>{new Date(puzzle.created_at * 1000).toLocaleString()}</td>
              </tr>
            ) : false)}
            <AddPuzzle onAdd={refetch} />
          </tbody>
        </table>
      </Flex>
    </Flex>
  )
}
