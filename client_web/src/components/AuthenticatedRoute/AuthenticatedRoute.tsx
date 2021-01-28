import React from 'react'
import { Route, RouteComponentProps, RouteProps } from 'react-router-dom'
import { User } from '../../generated/schema'
import useUser from '../../hooks/useUser'

interface AuthenticatedRouteProps {
  component:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>
  authCallback: (user: Partial<User> | undefined) => boolean
  RedirectComponent: JSX.Element
}

export default function AuthenticatedRoute({
  component: C,
  authCallback,
  RedirectComponent,
  ...rest
}: RouteProps & AuthenticatedRouteProps) {
  const { userInfo } = useUser()
  return (
    <Route
      {...rest}
      render={
        (props) =>
          authCallback(userInfo) ? <C {...props} /> : RedirectComponent
        // eslint-disable-next-line
      }
    />
  )
}
