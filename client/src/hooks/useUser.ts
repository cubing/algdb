import { useContext } from 'react'
import { UserContext } from '../providers/UserProvider'

const useUser = () => useContext(UserContext)
export default useUser
