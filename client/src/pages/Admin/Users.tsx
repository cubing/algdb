import React, { ReactElement, ChangeEvent } from 'react'
import { Flex, Heading, Spinner, Select, CircularProgress } from '@chakra-ui/core'
import useJqlQuery from '../../hooks/useJqlQuery'
import useJqlMutation from '../../hooks/useJqlMutation'
import { Maybe, User, UserPaginator, UserRole, UserRoleEnum } from '../../generated/jql'

type RoleSelectorProps = {
  user: string
  role: Maybe<UserRoleEnum> | undefined
}

type UpdateUserVariables = {
  id: string,
  role: Maybe<UserRole>
}

const Roles = [UserRole.Normal, UserRole.Moderator, UserRole.Admin];

const RoleSelector = ({ user, role }: RoleSelectorProps): ReactElement => {
  const [mutate, { isLoading, data, error }] = useJqlMutation<
    Maybe<User>,
    Error,
    UpdateUserVariables
  >('updateUser', {
    id: null,
    name: null,
    role: {
      id: null,
      name: null,
    },
  })
  
  const changeRole = async (event: ChangeEvent<HTMLSelectElement>) => {
    try {
      await mutate({
        id: user,
        role: Roles[parseInt(event.target.value, 10) - 1],
      })
    } catch (err) {
      console.error(err)
    }
  }

  if (error) {
    console.error(error);
  }

  const roleId = data ? data?.role?.id : role?.id;

  return (
    <Flex>
      {isLoading && <CircularProgress size="1em" /> }
      <Select variant="unstyled" value={roleId} onChange={changeRole}>
        <option value="1">Normal</option>
        <option value="2">Moderator</option>
        <option value="3">Admin</option>
      </Select>
    </Flex>
  )
}

const getUsersQuery = {
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
    getUsersQuery,
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
                <td><RoleSelector user={user.id} role={user?.role} /></td>
                <td>{new Date(user.created_at * 1000).toLocaleString()}</td>
              </tr>
            ) : false)}
          </tbody>
        </table>
      </Flex>
    </Flex>
  )
}
