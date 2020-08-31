import { User } from '../generated/jql'
import axios from 'axios'

const body = JSON.stringify({
	action: 'getCurrentUser',
	query: {
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
	},
})

export interface GetMeType {
	serverUrl: string
	authToken: string
}

export default async function getMe({
	serverUrl,
	authToken,
}: GetMeType): Promise<JqlRes<User | null>> {
	const res = await axios.post<JqlRes<User | null>>(serverUrl, body, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${authToken}`,
		},
	})
	return res.data
}
