import { UserContext } from '../providers/UserProvider'
import { useContext } from 'react'

const useUser = () => useContext(UserContext)
export default useUser
