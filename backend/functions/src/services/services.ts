import generateEnumService from './core/generator/enum.service'

const userRoleEnum = generateEnumService('userRole');

export { User } from './user/user.service'
export { Auth } from './auth/auth.service'

export { userRoleEnum as UserRoleEnum }