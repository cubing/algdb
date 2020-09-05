import React, { ReactElement } from 'react'
import { Flex, Heading, Spinner } from '@chakra-ui/core'
import useJqlQuery from '../../hooks/useJqlQuery'
import { AlgsetPaginator } from '../../generated/jql'

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
  const { isLoading, data, error } = useJqlQuery<AlgsetPaginator, Error>(
    'getMultipleAlgset',
    'getMultipleAlgset',
    getAlgsetsQuery,
  )

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
          </tbody>
        </table>
      </Flex>
    </Flex>
  )
}
