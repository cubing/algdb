import React, { ReactElement } from 'react'
import { Switch, Route, useRouteMatch, useLocation, Link, Redirect } from 'react-router-dom'
import { Flex, Menu, MenuItem, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/core'
import UsersPage from './Users'
import AlgsetsPage from './Algsets'
import PuzzlesPage from './Puzzles'

export default function Landing(): ReactElement {
  const match = useRouteMatch()
  const location = useLocation()
  console.log(location.pathname.split('/'));

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
        <Flex padding="1em">
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} to="/">Home</BreadcrumbLink>
            </BreadcrumbItem>

            {location.pathname.split('/').slice(1).map((path, index, array) => (
              <BreadcrumbItem isCurrentPage={index === array.length - 1}>
                <BreadcrumbLink as={Link} to={`/${array.slice(0, index + 1).join('/')}`}>{path}</BreadcrumbLink>
              </BreadcrumbItem>
            ))}
          </Breadcrumb>
        </Flex>
        <Flex flexDirection="column" padding="1em">
          <Switch>
            <Route path={`${match.path}/users`}>
              <UsersPage />
            </Route>
            <Route path={[
              `${match.path}/algsets`,
              `${match.path}/puzzles/:puzzleId/algsets`,
            ]}
            >
              <AlgsetsPage />
            </Route>
            <Route path={`${match.path}/puzzles`}>
              <PuzzlesPage />
            </Route>
            <Route exact path={match.path}>
              Home
            </Route>
            <Redirect to="/admin" />
          </Switch>
        </Flex>
      </Flex>
    </Flex>
  )
}
