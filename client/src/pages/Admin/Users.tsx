import React, { ReactElement } from 'react'
import { Flex, Heading, Spinner } from '@chakra-ui/core'
import useJqlQuery from '../../hooks/useJqlQuery'
import { UserPaginator } from '../../generated/jql'

export default function GetUsers(): ReactElement {
  const query = {
    paginatorInfo: {
      count: null,
      total: null,
    },
    data: {
      id: null,
      name: null,
      role: null,
      country: null,
      created_at: null,
    },
  }
  const { isLoading, data, error } = useJqlQuery<UserPaginator, Error>(
    'getMultipleUser',
    'getMultipleUser',
    query,
  )

  if (isLoading) {
    return <Spinner />
  }

  if (error) {
    console.log(error)
    return <>error</>
  }

  const users = data?.data

  return (
    <Flex justify="center" alignContent="center" direction="column">
      <Heading fontSize="4em" textAlign="center">
        Users
      </Heading>
      {users?.map((user) => (user ? <p key={user.id}>{user.name}</p> : false))}
    </Flex>
  )
}
