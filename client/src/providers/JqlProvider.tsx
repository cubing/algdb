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
		localStorage.getItem('algdb_auth_token')
	)
	const [expiresAt, setExpiresAt] = React.useState(
		parseInt(localStorage.getItem('algdb_expires_at') ?? '-1')
	)

	function resetAuth() {
		localStorage.removeItem('algdb_auth_token')
		localStorage.removeItem('algdb_expires_at')
	}

	function setAuth(authToken: string | null, expiresAt: number) {
		if (authToken) {
			localStorage.setItem('algdb_auth_token', authToken)
			localStorage.setItem('algdb_expires_at', expiresAt.toString())
			setAuthToken(authToken)
			setExpiresAt(expiresAt)
		}
	}

	return (
		<JqlContext.Provider
			value={{ authToken, expiresAt, serverUrl, resetAuth, setAuth }}>
			{children}
		</JqlContext.Provider>
	)
}

export { JqlContext }
export default JqlProvider
