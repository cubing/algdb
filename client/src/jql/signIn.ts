import { Auth } from '../generated/jql'
import axios from 'axios'

export interface SignInType {
	serverUrl: string
	authToken: string
}

const body = (code: string) =>
	JSON.stringify({
		action: 'socialLogin',
		query: {
			token: null,
			type: null,
			__args: {
				provider: 'wca',
				code: code,
			},
		},
	})

export default async function signIn({
	serverUrl,
	authToken,
}: SignInType): Promise<JqlRes<Auth>> {
	try {
		const postBody = body(authToken)
		const res = await axios.post<JqlRes<Auth>>(serverUrl, postBody, {
			headers: { 'Content-Type': 'application/json' },
		})
		return res.data
	} catch (err) {
		console.error(err.message)
		throw new Error('Unable to login')
	}
}
