import React, { ReactElement } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Landing from '../Landing/Landing'
// import Admin from '../Admin'
import WcaRedirect from '../WcaRedirect/WcaRedirect'
// import Puzzles from '../Puzzles/Puzzles'
// import Puzzle from '../Puzzle/Puzzle'
// import AuthenticatedRoute from '../../components/AuthenticatedRoute/AuthenticatedRoute'

export default function Navigation(): ReactElement {
  return (
    <Switch>
      <Route exact path="/wca-redirect">
        <WcaRedirect />
      </Route>
      <Route exact path="/">
        <Landing />
      </Route>
      {/* <Route exact path="/puzzle/:puzzleId" component={Puzzle} />
      <Route exact path="/users" />
      <Route exact path="/user" />
      <AuthenticatedRoute
        path="/admin"
        component={Admin}
        authCallback={(user) => true || user?.role.name === 'ADMIN'}
        RedirectComponent={<Redirect to="/" />}
      />
      <Route exac path="/puzzles">
        <Puzzles />
      </Route> */}
      <Redirect to="/" />
    </Switch>
  )
}
