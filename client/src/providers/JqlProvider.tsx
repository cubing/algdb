import React, { createContext } from 'react'

export interface IJqlContext {
  authToken: string | null
  expiresAt: number
  serverUrl: string
  resetAuth: () => void
  setAuth: (authToken: string | null, expiresAt: number) => void
}

const JqlContext = createContext<IJqlContext>({
  authToken: null,
  expiresAt: -1,
  serverUrl: '',
  resetAuth: () => {},
  setAuth: () => {},
})

JqlContext.displayName = 'JQL Contxet'

const JqlProvider = ({
  children,
  serverUrl,
}: React.PropsWithChildren<{ serverUrl: string }>) => {
  const [authToken, setAuthToken] = React.useState(
    localStorage.getItem('algdb_auth_token'),
  )
  const [expiresAt, setExpiresAt] = React.useState(
    parseInt(localStorage.getItem('algdb_expires_at') ?? '-1', 10),
  )

  function resetAuth() {
    localStorage.removeItem('algdb_auth_token')
    localStorage.removeItem('algdb_expires_at')
  }

  function setAuth(_authToken: string | null, _expiresAt: number) {
    if (_authToken) {
      localStorage.setItem('algdb_auth_token', _authToken)
      localStorage.setItem('algdb_expires_at', _expiresAt.toString())
      setAuthToken(_authToken)
      setExpiresAt(_expiresAt)
    }
  }

  const value = React.useMemo(
    () => ({ authToken, expiresAt, serverUrl, resetAuth, setAuth }),
    [authToken, expiresAt, serverUrl],
  )

  return (
    <JqlContext.Provider
      value={{
        authToken,
        expiresAt,
        serverUrl,
        resetAuth,
        setAuth,
      }}
    >
      {children}
    </JqlContext.Provider>
  )
}

export { JqlContext }
export default JqlProvider
