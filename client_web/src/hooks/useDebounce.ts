import { useState, useCallback } from 'react'
import debounce from 'lodash.debounce'

interface DebounceOptions<T> {
  defaultValue: T
  delay: number
  options?: {
    leading: boolean
    trailing: boolean
  }
}

function useDebounce<T>({
  defaultValue,
  delay = 500,
  options = defaultOptions,
}: DebounceOptions<T>): [
  T,
  (val: T) => void,
  { signal: number; debouncing: boolean },
] {
  const [value, setValueImmediately] = useState(defaultValue)
  const [debouncing, setDebouncing] = useState(false)
  const [signal, setSignal] = useState(Date.now())

  const setValue = useCallback((callbackVal) => {
    setValueImmediately(callbackVal)
    setDebouncing(true)
    triggerUpdate()
  }, [])

  const triggerUpdate = useCallback(
    debounce(
      () => {
        setDebouncing(false)
        setSignal(Date.now())
      },
      delay,
      options,
    ),
    [],
  )

  return [
    value,
    setValue,
    {
      signal,
      debouncing,
    },
  ]
}
export default useDebounce
const defaultOptions = { leading: false, trailing: true }
