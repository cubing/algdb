import User from "./types/user/rootResolver";
import Auth from "./types/auth/rootResolver";
import Puzzle from "./types/puzzle/rootResolver";
import Algset from "./types/algset/rootResolver";
import Algcase from "./types/algcase/rootResolver";
import Alg from "./types/alg/rootResolver";
import AlgAlgcaseLink from "./links/algAlgcaseLink/rootResolver";
import { generateBlankRootResolver } from "./helpers/rootResolver";
import { generateKenumRootResolver } from "./core/generators";
import { generateEnumRootResolver } from "./core/generators";
import { CaseVisualization, UserRole, FilterOperator } from "./services";

const rootResolversArray = [
  User,
  Auth,
  Puzzle,
  Algset,
  Algcase,
  Alg,
  AlgAlgcaseLink,
  generateKenumRootResolver(UserRole),
  generateEnumRootResolver(FilterOperator),
  generateEnumRootResolver(CaseVisualization),
];

const rootResolvers = generateBlankRootResolver();

function mergeResolvers(resolversArray: any) {
  for (const resolver of resolversArray) {
    for (const prop in resolver) {
      for (const operation in resolver[prop]) {
        rootResolvers[prop][operation] = resolver[prop][operation];
      }
    }
  }
}

mergeResolvers(rootResolversArray);

export { rootResolvers };
