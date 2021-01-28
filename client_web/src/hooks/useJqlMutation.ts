import { useMutation, MutationConfig, MutationResultPair } from 'react-query'
import axios from 'axios'
import useJql from './useJql'
import { Root, GetQuery, GetResponse } from '../generated/schema'

export default function useJqlMutation<
  Key extends keyof Root,
  TError = unknown,
  TVariables = undefined,
  TSnapshot = unknown
>(
  query: GetQuery<Key>,
  config?:
    | MutationConfig<GetResponse<Key>, TError, TVariables, TSnapshot>
    | undefined,
): MutationResultPair<GetResponse<Key>, TError, TVariables, TSnapshot> {
  const { serverUrl, authToken } = useJql()

  async function algdbMutate<T>() {
    const body = JSON.stringify(query)
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
      console.error(`Unable to perform mutation: ${query}`)
      throw err
    }
  }

  const mutationInfo = useMutation<
    GetResponse<Key>,
    TError,
    TVariables,
    TSnapshot
  >(algdbMutate, config)
  return mutationInfo
}
