import * as generators from "./core/generators";

import { User, Puzzle, Algset, Algcase, Alg } from "./services";

import user from "./user/typeDef";
import auth from "./auth/typeDef";
import puzzle from "./puzzle/typeDef";
import algset from "./algset/typeDef";
import algcase from "./algcase/typeDef";
import alg from "./alg/typeDef";
import algAlgcaseLink from "./link/algAlgcaseLink/typeDef";

import { userRoleEnum, caseVisualizationEnum } from "./enums";

export const typeDefs = {
  user,
  userPaginator: generators.generatePaginatorTypeDef(User),

  puzzle,
  puzzlePaginator: generators.generatePaginatorTypeDef(Puzzle),

  algset,
  algsetPaginator: generators.generatePaginatorTypeDef(Algset),

  algcase,
  algcasePaginator: generators.generatePaginatorTypeDef(Algcase),

  alg,
  algPaginator: generators.generatePaginatorTypeDef(Alg),

  algAlgcaseLink,

  auth,

  //specifying a bogus service, as it will never be used (for definition only)
  paginatorInfo: generators.generatePaginatorInfoTypeDef(User),

  userRole: generators.generateKenumTypeDef(userRoleEnum),
  caseVisualization: generators.generateEnumTypeDef(caseVisualizationEnum),
};
