import generatePaginatorTypeDef from './core/generator/paginator.typeDef'
import generatePaginatorInfoTypeDef from './core/generator/paginatorInfo.typeDef';

import generateEnumTypeDef from './core/generator/enum.typeDef'

import { User } from './services'

import user from './user/user.typeDef'

import auth from './auth/auth.typeDef'

import { userRoleEnum } from './enum/userRoleEnum';

export const typeDefs = {
  user,
  userPaginator: generatePaginatorTypeDef(User),
  auth,
  paginatorInfo: generatePaginatorInfoTypeDef(),
  userRoleEnum: generateEnumTypeDef(userRoleEnum),
}