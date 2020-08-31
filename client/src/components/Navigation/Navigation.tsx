import React, { ReactElement } from 'react'
import { Switch, Route } from 'react-router-dom'
import Landing from '../Landing/Landing'
import WcaRedirect from '../WcaRedirect/WcaRedirect'

export default function Navigation(): ReactElement {
	return (
		<Switch>
			<Route exact path='/wca-redirect'>
				<WcaRedirect />
			</Route>
			<Route exact path='/'>
				<Landing />
			</Route>
			<Route exact path='/puzzle/:puzzleId'></Route>
			<Route exact path='/users'></Route>
			<Route exact path='/user'></Route>
		</Switch>
	)
}
