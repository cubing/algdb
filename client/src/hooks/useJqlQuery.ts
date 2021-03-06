import { useQuery, QueryKey, QueryConfig, QueryResult } from 'react-query'
import axios from 'axios'
import useJql from './useJql'
import { Query, Mutation } from '../generated/schema'

export interface AlgDBFetchArgs {
  serverUrl: string
  authToken: string | null
  action: keyof Query | keyof Mutation
  query: {
    [key: string]: any
  }
}
export async function algDbFetch<T>(
  key: QueryKey,
  { serverUrl, authToken, action, query }: AlgDBFetchArgs,
): Promise<T> {
  const body = JSON.stringify({ action, query })
  const headers: { [key: string]: string } = {
    'Content-Type': 'application/json',
  }
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`
  }
  try {
    const res = await axios.post<JqlRes<T>>(serverUrl, body, { headers })
    return res.data.data
  } catch (err) {
    console.error(`Unable to perform query: ${action} with key ${key}`)
    throw err
  }
}

export default function useJqlQuery<TResult, TError = Error>(
  key: QueryKey,
  action: keyof Query | keyof Mutation,
  query: JqlQuery['query'],
  config?: QueryConfig<TResult, TError>,
): QueryResult<TResult, TError> {
  const { serverUrl, authToken } = useJql()
  const queryInfo = useQuery<TResult, TError>(
    [key, { serverUrl, authToken, action, query }],
    algDbFetch,
    { refetchOnWindowFocus: false, ...config },
  )

  return queryInfo
}
