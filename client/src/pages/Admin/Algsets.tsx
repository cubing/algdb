import React, { ReactElement, useState, ChangeEvent, MouseEvent, FormEvent } from 'react'
import { Flex, Heading, Spinner, Input, Button, Select } from '@chakra-ui/core'
import useJqlQuery from '../../hooks/useJqlQuery'
import useJqlMutation from '../../hooks/useJqlMutation'
import { Maybe, Algset, AlgsetPaginator, Puzzle, PuzzlePaginator } from '../../generated/jql'

type AddAlgsetProps = {
  onAdd: () => void
  puzzles: Array<Maybe<Puzzle>>
}

type AddAlgsetMutationArgs = {
  name: string
  puzzle: string
}

function AddAlgset({ onAdd, puzzles }: AddAlgsetProps): ReactElement {
  const [algsetName, setAlgsetName] = useState<string>('')
  const [selectedPuzzle, setSelectedPuzzle] = useState<string>('0')

  const [mutate, { isLoading, error }] = useJqlMutation<
    Maybe<Algset>,
    Error,
    AddAlgsetMutationArgs
  >('createAlgset', {
    id: null,
    name: null,
  })

  const onClick = async (e: MouseEvent<HTMLButtonElement> | FormEvent) => {
    e.preventDefault();
    if (algsetName) {
      try {
        await mutate({
          name: algsetName,
          puzzle: selectedPuzzle,
        })
        onAdd()
        setAlgsetName('')
      } catch (err) {
        console.error(err)
      }
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAlgsetName(event.target.value)
  }

  const handleChangePuzzle = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedPuzzle(event.target.value)
  }

  if (error) {
    console.error(error);
  }

  return (
    <tr>
      <td />
      <td>
        <Input placeholder="OLL" value={algsetName} onChange={handleChange} />
      </td>
      <td>
        <Select value={selectedPuzzle} onChange={handleChangePuzzle}>
          <option key={0} value="0">Select</option>
          {puzzles.map((puzzle) => (
            <option key={puzzle?.id} value={puzzle?.id}>{puzzle?.name}</option>
          ))}
        </Select>
      </td>
      <td>
        <Button isLoading={isLoading} isDisabled={!algsetName} onClick={onClick}>Add</Button>
      </td>
    </tr>
  )
}

const getAlgsetsQuery = {
  paginatorInfo: {
    count: null,
    total: null,
  },
  data: {
    id: null,
    name: null,
    puzzle: {
      name: null,
    },
    created_at: null,
  },
}

export default function Algsets(): ReactElement {
  const { isLoading, data, refetch, error } = useJqlQuery<AlgsetPaginator, Error>(
    'getMultipleAlgset',
    'getMultipleAlgset',
    getAlgsetsQuery,
  )

  const puzzleQuery = useJqlQuery<PuzzlePaginator, Error>(
    'getMultiplePuzzle',
    'getMultiplePuzzle',
    {
      data: {
        name: null
      }
    }
  )

  const puzzles = puzzleQuery?.data?.data || [];

  const algsets = data?.data || [];

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
        Algsets
      </Heading>
      <Flex w="80%" align="center" direction="column">
        <table width="100%">
          <thead>
            <tr>
              <th style={{textAlign: 'left'}}>ID</th>
              <th style={{textAlign: 'left'}}>Name</th>
              <th style={{textAlign: 'left'}}>Puzzle</th>
              <th style={{textAlign: 'left'}}>Created</th>
            </tr>
          </thead>
          <tbody>
            {algsets.map((algset) => algset ? (
              <tr key={algset.id}>
                <td>{algset.id}</td>
                <td>{algset.name}</td>
                <td>{algset.puzzle?.name}</td>
                <td>{new Date(algset.created_at * 1000).toLocaleString()}</td>
              </tr>
            ) : false)}
            <AddAlgset onAdd={refetch} puzzles={puzzles} />
          </tbody>
        </table>
      </Flex>
    </Flex>
  )
}
