import { generators } from '../jql';

import { User, Puzzle, Algset, Subset, Algcase, Alg, Tag, AlgAlgcaseLink, AlgTagLink, UserAlgTagLink } from './services'

import user from './user/typeDef'

import auth from './auth/typeDef'

import puzzle from './puzzle/typeDef'

import algset from './algset/typeDef'

import subset from './subset/typeDef'

import algcase from './algcase/typeDef'

import alg from './alg/typeDef'

import algAlgcaseLink from './link/algAlgcaseLink/typeDef'
import algTagLink from './link/algTagLink/typeDef'
import userAlgTagLink from './link/userAlgTagLink/typeDef'

import tag from './tag/typeDef'

import { userRole, caseVisualization } from './enums';

export const typeDefs = {
  user,
  userPaginator: generators.generatePaginatorTypeDef(User),
  puzzle,
  puzzlePaginator: generators.generatePaginatorTypeDef(Puzzle),
  algset,
  algsetPaginator: generators.generatePaginatorTypeDef(Algset),
  subset,
  subsetPaginator: generators.generatePaginatorTypeDef(Subset),

  algcase,
  algcasePaginator: generators.generatePaginatorTypeDef(Algcase),

  alg,
  algPaginator: generators.generatePaginatorTypeDef(Alg),

  algAlgcaseLink,
  algAlgcaseLinkPaginator: generators.generatePaginatorTypeDef(AlgAlgcaseLink),

  algTagLink,
  algTagLinkPaginator: generators.generatePaginatorTypeDef(AlgTagLink),

  userAlgTagLink,
  userAlgTagLinkPaginator: generators.generatePaginatorTypeDef(UserAlgTagLink),

  tag,
  tagPaginator: generators.generatePaginatorTypeDef(Tag),

  auth,
  paginatorInfo: generators.generatePaginatorInfoTypeDef(),
  userRoleEnum: generators.generateEnumTypeDef(userRole),
  caseVisualizationEnum: generators.generateEnumTypeDef(caseVisualization),
};