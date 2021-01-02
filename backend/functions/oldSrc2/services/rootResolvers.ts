import User from "./user/rootResolver";
import Auth from "./auth/rootResolver";
import Puzzle from "./puzzle/rootResolver";
import Algset from "./algset/rootResolver";
import Algcase from "./algcase/rootResolver";
import Alg from "./alg/rootResolver";
import AlgAlgcaseLink from "./link/algAlgcaseLink/rootResolver";

import {
  generateKenumRootResolver,
  generateEnumRootResolver,
} from "./core/generators";
import { UserRole, CaseVisualization } from "./services";

const rootResolvers = [
  User,
  Auth,
  Puzzle,
  Algset,
  Algcase,
  Alg,
  AlgAlgcaseLink,
  generateKenumRootResolver(UserRole),
  generateEnumRootResolver(CaseVisualization),
];

const resolvers = {
  query: {},
  mutation: {},
  subscription: {},
};

function mergeResolvers(resolversArray: any) {
  for (const resolver of resolversArray) {
    for (const prop in resolver) {
      for (const operation in resolver[prop]) {
        resolvers[prop][operation] = resolver[prop][operation];
      }
    }
  }
}

mergeResolvers(rootResolvers);

export default resolvers;
