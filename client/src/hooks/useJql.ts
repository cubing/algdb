import { useContext } from 'react'
import { JqlContext } from '../providers/JqlProvider'

export default function useJql() {
  return useContext(JqlContext)
}
