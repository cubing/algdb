import generateEnumService from './core/generator/enum.service'

const StatusEnum = generateEnumService('status');

export { User } from './user/user.service'
export { Auth } from './auth/auth.service'

export { StatusEnum }