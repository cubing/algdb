import { caseVisualizationEnum, userRoleKenum } from "./enums";
import { KenumService, EnumService } from "./core/services";

import { UserService } from "./models/user/service";
import { AuthService } from "./models/auth/service";
import { PuzzleService } from "./models/puzzle/service";
import { AlgsetService } from "./models/algset/service";
import { AlgcaseService } from "./models/algcase/service";
import { AlgService } from "./models/alg/service";
import { TagService } from "./models/tag/service";

import { AlgAlgcaseLinkService } from "./links/algAlgcaseLink/service";
import { AlgTagLinkService } from "./links/algTagLink/service";
import { UserAlgVoteLinkService } from "./links/userAlgVoteLink/service";

export const User = new UserService();
export const Puzzle = new PuzzleService();
export const Algset = new AlgsetService();
export const Algcase = new AlgcaseService();
export const Alg = new AlgService();
export const Auth = new AuthService();
export const Tag = new TagService();

export const AlgAlgcaseLink = new AlgAlgcaseLinkService([Alg, Algcase]);
export const AlgTagLink = new AlgTagLinkService([Alg, Tag]);

// don't autogenerate the typeDef on this one. will specify manually
export const UserAlgVoteLink = new UserAlgVoteLinkService([User, Alg], false);

export const UserRole = new KenumService("userRole", userRoleKenum);

export const CaseVisualization = new EnumService(
  "caseVisualization",
  caseVisualizationEnum
);
