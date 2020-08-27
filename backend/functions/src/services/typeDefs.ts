import generatePaginatorTypeDef from './core/generator/paginator.typeDef'
import generatePaginatorInfoTypeDef from './core/generator/paginatorInfo.typeDef';

import { User } from './services'

import user from './user/user.typeDef'

import auth from './auth/auth.typeDef'
export const typeDefs = {
  user,
  userPaginator: generatePaginatorTypeDef(User),
  auth,
  paginatorInfo: generatePaginatorInfoTypeDef(),
}