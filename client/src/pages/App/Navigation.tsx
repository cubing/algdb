import React, { ReactElement } from 'react'
import { Switch, Route } from 'react-router-dom'
import Landing from '../Landing/Landing'
import AdminUsers from '../Admin/Users'
import WcaRedirect from '../../components/WcaRedirect/WcaRedirect'

export default function Navigation(): ReactElement {
	return (
  <Switch>
    <Route exact path='/wca-redirect'>
      <WcaRedirect />
    </Route>
    <Route exact path='/'>
      <Landing />
    </Route>
    <Route exact path='/puzzle/:puzzleId' />
    <Route exact path='/users' />
    <Route exact path='/user' />
    <Route exact path='/admin/users'>
      <AdminUsers />
    </Route>
  </Switch>
	)
}