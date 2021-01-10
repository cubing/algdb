import { filterOperatorEnum, caseVisualizationEnum } from "./enums";
import { userRoleKenum } from "./enums";
import { KenumService, EnumService } from "./core/services";

import { UserService } from "./types/user/service";
import { AuthService } from "./types/auth/service";
import { PuzzleService } from "./types/puzzle/service";
import { AlgsetService } from "./types/algset/service";
import { AlgcaseService } from "./types/algcase/service";
import { AlgService } from "./types/alg/service";
import { TagService } from "./types/tag/service";

import { AlgAlgcaseLinkService } from "./links/algAlgcaseLink/service";
import { AlgTagLinkService } from "./links/algTagLink/service";

export const User = new UserService();
export const Puzzle = new PuzzleService();
export const Algset = new AlgsetService();
export const Algcase = new AlgcaseService();
export const Alg = new AlgService();
export const Auth = new AuthService();
export const Tag = new TagService();

export const AlgAlgcaseLink = new AlgAlgcaseLinkService([Alg, Algcase]);
export const AlgTagLink = new AlgTagLinkService([Alg, Tag]);

export const UserRole = new KenumService("userRole", userRoleKenum);
export const FilterOperator = new EnumService(
  "filterOperator",
  filterOperatorEnum
);
export const CaseVisualization = new EnumService(
  "caseVisualization",
  caseVisualizationEnum
);
