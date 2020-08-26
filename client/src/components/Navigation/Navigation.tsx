import React, { ReactElement } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Landing from '../Landing/Landing'
export default function Navigation(): ReactElement {
	return (
		<Switch>
			<Route exact path='/'>
				<Landing />
			</Route>
			<Route exact path='/puzzle/:puzzleId'></Route>
			<Route exact path='/users'></Route>
			<Route exact path='/user'></Route>
		</Switch>
	)
}
