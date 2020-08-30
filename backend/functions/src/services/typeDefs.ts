import generatePaginatorTypeDef from './core/generator/paginator.typeDef'
import generatePaginatorInfoTypeDef from './core/generator/paginatorInfo.typeDef';

import generateEnumTypeDef from './core/generator/enum.typeDef'

import { User, Puzzle, Algset, Subset, Algcase, Alg, AlgAlgcaseLink } from './services'

import user from './user/user.typeDef'

import auth from './auth/auth.typeDef'

import puzzle from './puzzle/puzzle.typeDef'

import algset from './algset/algset.typeDef'

import subset from './subset/subset.typeDef'

import algcase from './algcase/algcase.typeDef'

import alg from './alg/alg.typeDef'

import algAlgcaseLink from './link/algAlgcaseLink/algAlgcaseLink.typeDef'

import { userRole, caseVisualization } from './enums';

export const typeDefs = {
  user,
  userPaginator: generatePaginatorTypeDef(User),
  puzzle,
  puzzlePaginator: generatePaginatorTypeDef(Puzzle),
  algset,
  algsetPaginator: generatePaginatorTypeDef(Algset),
  subset,
  subsetPaginator: generatePaginatorTypeDef(Subset),

  algcase,
  algcasePaginator: generatePaginatorTypeDef(Algcase),

  alg,
  algPaginator: generatePaginatorTypeDef(Alg),

  algAlgcaseLink,
  algAlgcaseLinkPaginator: generatePaginatorTypeDef(AlgAlgcaseLink),

  auth,
  paginatorInfo: generatePaginatorInfoTypeDef(),
  userRoleEnum: generateEnumTypeDef(userRole),
  caseVisualizationEnum: generateEnumTypeDef(caseVisualization),
};