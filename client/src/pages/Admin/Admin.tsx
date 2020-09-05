import React, { ReactElement } from 'react'
import { Switch, Route, useRouteMatch, Link, Redirect } from 'react-router-dom'
import { Flex, Menu, MenuList, MenuItem, MenuButton } from '@chakra-ui/core'
import UsersPage from './Users'
import AlgsetsPage from './Algsets'
import PuzzlesPage from './Puzzles'

export default function Landing(): ReactElement {
  const match = useRouteMatch()
  console.log(match.path)

  return (
    <Flex>
      <Flex w="20%" flexDirection="column">
        <Menu>
          <MenuItem as={Link} to={`${match.url}/users`}>Users</MenuItem>
          <MenuItem as={Link} to={`${match.url}/puzzles`}>Puzzles</MenuItem>
          <MenuItem as={Link} to={`${match.url}/algsets`}>Algsets</MenuItem>
        </Menu>
      </Flex>
      <Flex w="80%" flexDirection="column">
        <Switch>
          <Route path={`${match.path}/users`}>
            <UsersPage />
          </Route>
          <Route path={`${match.path}/puzzles`}>
            <PuzzlesPage />
          </Route>
          <Route path={`${match.path}/algsets`}>
            <AlgsetsPage />
          </Route>
          <Route exact path={match.path}>
            Home
          </Route>
          <Redirect to="/admin" />
        </Switch>
      </Flex>
    </Flex>
  )
}
