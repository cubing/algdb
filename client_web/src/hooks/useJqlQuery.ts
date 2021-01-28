import { useQuery, QueryKey, QueryConfig, QueryResult } from 'react-query'
import axios from 'axios'
import useJql from './useJql'
import { Root, GetResponse, GetQuery } from '../generated/schema'

export interface AlgDBFetchArgs {
  serverUrl: string
  authToken: string | null
  query: any
}
export async function algDbFetch<T>(
  key: QueryKey,
  { serverUrl, authToken, query }: AlgDBFetchArgs,
): Promise<T> {
  const body = JSON.stringify(query)
  const headers: { [key: string]: string } = {
    'Content-Type': 'application/json',
  }
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`
  }
  try {
    const res = await axios.post(serverUrl, body, { headers })
    return res.data.data
  } catch (err) {
    console.error(`Unable to perform query: ${body} with key ${key}`)
    throw err
  }
}

export default function useJqlQuery<Key extends keyof Root, TError = Error>(
  key: QueryKey,
  query: GetQuery<Key>,
  config?: QueryConfig<GetResponse<Key>, TError>,
): QueryResult<GetResponse<Key>, TError> {
  const { serverUrl, authToken } = useJql()
  const queryInfo = useQuery<GetResponse<Key>, TError>(
    [key, { serverUrl, authToken, query }],
    algDbFetch,
    { refetchOnWindowFocus: false, ...config },
  )

  return queryInfo
}
