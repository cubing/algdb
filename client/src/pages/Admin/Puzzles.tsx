import React, { ReactElement } from 'react'
import { Flex, Heading, Spinner } from '@chakra-ui/core'
import useJqlQuery from '../../hooks/useJqlQuery'
import { PuzzlePaginator } from '../../generated/jql'

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
  const { isLoading, data, error } = useJqlQuery<PuzzlePaginator, Error>(
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
          </tbody>
        </table>
      </Flex>
    </Flex>
  )
}
