import React, { createContext } from 'react'
import {
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import { User } from '../generated/schema'
import useJql from '../hooks/useJql'
import { WCA_LOGIN_REDIRECT } from '../config'
import useJqlMutation from '../hooks/useJqlMutation'

export interface IUserContext {
  isLoggedIn: () => boolean
  userInfo?: Pick<
    User,
    | 'id'
    | 'provider'
    | 'provider_id'
    | 'wca_id'
    | 'email'
    | 'name'
    | 'avatar'
    | 'country'
    | 'is_public'
    | 'role'
    | 'created_at'
    | 'updated_at'
    | 'created_by'
  >
  signIn: () => void
  signOut: () => void
}

const UserContext = createContext<IUserContext>({
  signIn: () => {},
  signOut: () => {},
  isLoggedIn: () => false,
})

UserContext.displayName = 'User Context'

const UserProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const { authToken, expiresAt, resetAuth } = useJql()
  const [user, setUser] = React.useState<
    IUserContext['userInfo'] | null | undefined
  >(null)

  const [mutate, { isLoading, data, error }] = useJqlMutation<
    'getCurrentUser',
    Error
  >({
    getCurrentUser: {
      id: true,
      wca_id: true,
      email: true,
      avatar: true,
      country: true,
      is_public: true,
      role: true,
      name: true,
      created_at: true,
    },
  })

  function signIn() {
    resetAuth()
    window.location.href = WCA_LOGIN_REDIRECT
  }

  function signOut() {
    resetAuth()
    window.location.reload()
  }

  const isLoggedIn = () => user !== null && user !== undefined

  React.useEffect(() => {
    const expiresWithinHour =
      new Date(expiresAt).getTime() > Date.now() - 100 * 60 * 60

    if (authToken) {
      if (expiresWithinHour) signIn()
      else {
        mutate()
      }
    } else {
      setUser(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    if (data) {
      setUser(data)
    }
  }, [data])

  const value = React.useMemo(
    () => ({ signIn, signOut, userInfo: data ?? undefined, isLoggedIn }),
    [user],
  )

  if (isLoading) return <Spinner />

  return (
    <UserContext.Provider value={value}>
      {error ? (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle mr={2}>Error when fetching user</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      ) : (
        false
      )}
      {children}
    </UserContext.Provider>
  )
}

export { UserContext }
export default UserProvider
