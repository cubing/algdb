import React, { createContext } from 'react'
import { User } from '../generated/jql'
import useJql from '../hooks/useJql'
import { WCA_LOGIN_REDIRECT } from '../config'
import { GetMeType } from '../jql/getMe'
import useJqlMutation from '../hooks/useJqlMutation'

export interface IUserContext {
  isLoggedIn: boolean
  userInfo?: User
  signIn: () => void
  signOut: () => void
}

const UserContext = createContext<IUserContext>({
  signIn: () => {},
  signOut: () => {},
  isLoggedIn: false,
})

UserContext.displayName = 'User Context'

const UserProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const { serverUrl, authToken, expiresAt, resetAuth } = useJql()
  const [user, setUser] = React.useState<User>()
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
  const [mutate, { isLoading, data, error }] = useJqlMutation<
    JqlRes<User | null>,
    Error,
    GetMeType
  >('getCurrentUser', query)

  function signIn() {
    window.location.href = WCA_LOGIN_REDIRECT
  }

  function signOut() {
    resetAuth()
    window.location.reload()
  }

  React.useEffect(() => {
    const expiresWithinHour =
      new Date(expiresAt).getTime() > Date.now() - 100 * 60 * 60
    if (authToken) {
      if (expiresWithinHour) signIn()
      else {
        mutate({ serverUrl, authToken })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expiresAt, authToken])

  React.useEffect(() => {
    if (data?.data) {
      setUser(data.data)
    }
  }, [data])

  const value = React.useMemo(
    () => ({ signIn, signOut, userInfo: user, isLoggedIn: Boolean(user) }),
    [user],
  )

  if (isLoading) return <></>
  if (error) return <p>{error.message}</p>
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export { UserContext }
export default UserProvider
