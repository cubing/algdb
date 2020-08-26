import React from 'react'
import { Route, RouteComponentProps, RouteProps } from 'react-router-dom'

type User = any // declare or import user

interface AuthenticatedRouteProps {
	component:
		| React.ComponentType<RouteComponentProps<any>>
		| React.ComponentType<any>
	authCallback: (user: User) => boolean
	RedirectComponent: JSX.Element
}

export default function AuthenticatedRoute({
	component: C,
	authCallback,
	RedirectComponent,
	...rest
}: RouteProps & AuthenticatedRouteProps) {
	const user: User = {} // get the current user, through any state mangagement lib or React Context
	return (
		<Route
			{...rest}
			render={(props) =>
				authCallback(user) ? <C {...props} /> : RedirectComponent
			}
		/>
	)
}
