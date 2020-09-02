import axios from 'axios'
import { UserPaginator } from '../generated/jql'

const body = JSON.stringify({
	action: "getMultipleUser",
	query: {
		paginatorInfo: {
			count: null,
			total: null
		},
		data: {
			id: null,
			name: null,
			role: null,
			country: null,
			created_at: null
		}
	}
})

export interface GetUsersType {
  serverUrl: string
  authToken: string
}

export default async function getMultipleUser(): Promise<JqlRes<UserPaginator>> {
  const res = await axios.post<JqlRes<UserPaginator>>('https://us-central1-algdb-d312e.cloudfunctions.net/api/jql', body, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return res.data
}
