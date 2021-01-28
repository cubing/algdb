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
  userInfo?: User
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
  const [user, setUser] = React.useState<User | null | undefined>(null)
  const query = {
    id: null,
    wca_id: null,
    email: null,
    avatar: null,
    country: null,
    is_public: null,
    role: {
      id: null,
      name: null,
    },
  }
  const [mutate, { isLoading, data, error }] = useJqlMutation<User, Error>(
    'getCurrentUser',
    query,
  )

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
    () => ({ signIn, signOut, userInfo: user ?? undefined, isLoggedIn }),
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
