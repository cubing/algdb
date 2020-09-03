/* eslint-disable no-nested-ternary */
import React, { ReactElement } from 'react'
import { Flex, Heading, Spinner, Box } from '@chakra-ui/core'
import useJqlQuery from '../../hooks/useJqlQuery'
import { UserPaginator } from '../../generated/jql'

const query = {
  paginatorInfo: {
    count: null,
    total: null,
  },
  data: {
    id: null,
    name: null,
    role: {
      name: null,
    },
    created_at: null,
  },
}

export default function GetUsers(): ReactElement {
  const { isLoading, data, error } = useJqlQuery<UserPaginator, Error>(
    'getMultipleUser',
    'getMultipleUser',
    query,
  )

  const users = data?.data || [];

  if (isLoading) {
    return <Spinner />
  }

  if (error) {
    console.log(error)
    return <>error</>
  }

  return (
    <Flex justify="center" align="center" direction="column">
      <Heading fontSize="4em" textAlign="center">
        Users
      </Heading>
      <Flex w="80%" align="center" direction="column">
        <table width="100%">
          <thead>
            <tr>
              <th style={{textAlign: 'left'}}>ID</th>
              <th style={{textAlign: 'left'}}>Name</th>
              <th style={{textAlign: 'left'}}>Role</th>
              <th style={{textAlign: 'left'}}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => user ? (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user?.role?.name}</td>
                <td>{new Date(user.created_at * 1000).toLocaleString()}</td>
              </tr>
            ) : false)}
          </tbody>
        </table>
      </Flex>
    </Flex>
  )
}
