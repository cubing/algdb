import React, { ReactElement } from 'react'
import { useQuery } from 'react-query'
import { Flex, Heading, Spinner } from '@chakra-ui/core'
import getMultipleUser from '../../jql/getUsers'

export default function GetUsers(): ReactElement {
  const { isLoading, data, error } = useQuery('getMultipleUser', getMultipleUser)

  console.log(isLoading, error, data);

  if (isLoading) {
    return <Spinner />
  }

  if (error) {
    console.log(error)
    return <>error</>
  }

  const userPaginator = data?.data;
  const users = userPaginator?.data; // ugh

	return (
  <Flex justify='center' alignContent='center' direction='column'>
    <Heading fontSize='4em' textAlign='center'>
      Users
    </Heading>
    {users?.map((user) => user ? (
      <p key={user.id}>{user.name}</p>
    ) : false)}
  </Flex>
	)
}
