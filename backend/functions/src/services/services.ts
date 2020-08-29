import generateEnumService from './core/generator/enum.service'
import { userRoleEnum as userRole } from './enum/userRoleEnum';

const userRoleEnum = generateEnumService('userRole', userRole);

export { User } from './user/user.service'
export { Auth } from './auth/auth.service'
export { Puzzle } from './puzzle/puzzle.service'

export { userRoleEnum as UserRoleEnum }