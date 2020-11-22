import { userRoleEnum, caseVisualizationEnum } from "./enums";
import { generateKenumService, generateEnumService } from "./core/generators";

import { UserService } from "./user/service";
import { AuthService } from "./auth/service";
import { PuzzleService } from "./puzzle/service";
import { AlgsetService } from "./algset/service";
import { AlgcaseService } from "./algcase/service";
import { AlgService } from "./alg/service";
import { AlgAlgcaseLinkService } from "./link/algAlgcaseLink/service";

export const User = new UserService();
export const Auth = new AuthService();
export const Puzzle = new PuzzleService();
export const Algset = new AlgsetService();
export const Algcase = new AlgcaseService();
export const Alg = new AlgService();
export const AlgAlgcaseLink = new AlgAlgcaseLinkService();

export const UserRole = generateKenumService("userRole", userRoleEnum);
export const CaseVisualization = generateEnumService(
  "caseVisualization",
  caseVisualizationEnum
);
