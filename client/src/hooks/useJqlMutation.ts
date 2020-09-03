import { useMutation, MutationConfig, MutationResultPair } from 'react-query'
import axios from 'axios'
import useJql from './useJql'

export default function useJqlMutation<
  TResult,
  TError = unknown,
  TVariables = undefined,
  TSnapshot = unknown
>(
  action: JqlQuery['action'],
  query: JqlQuery['query'],
  config?: MutationConfig<TResult, TError, TVariables, TSnapshot> | undefined,
): MutationResultPair<TResult, TError, TVariables, TSnapshot> {
  const { serverUrl, authToken } = useJql()

  async function algdbMutate<T>() {
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
      console.error(`Unable to perform mutation: ${action}`)
      throw err
    }
  }

  const mutationInfo = useMutation<TResult, TError, TVariables, TSnapshot>(
    algdbMutate,
    config,
  )
  return mutationInfo
}
