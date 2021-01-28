export const rootResolverMap: RootResolverMap = new Map();

import User from "./types/user/rootResolver";
import Auth from "./types/auth/rootResolver";
import Puzzle from "./types/puzzle/rootResolver";
import Algset from "./types/algset/rootResolver";
import Algcase from "./types/algcase/rootResolver";
import Alg from "./types/alg/rootResolver";
import Tag from "./types/tag/rootResolver";

import AlgAlgcaseLink from "./links/algAlgcaseLink/rootResolver";
import AlgTagLink from "./links/algTagLink/rootResolver";
import { generateEnumRootResolver } from "./helpers/rootResolver";
import { CaseVisualization, UserRole, FilterOperator } from "./services";
import { RootResolverMap } from "jomql";

const rootResolversArray = [
  User,
  Auth,
  Puzzle,
  Algset,
  Algcase,
  Alg,
  Tag,
  AlgAlgcaseLink,
  AlgTagLink,
  generateEnumRootResolver(UserRole),
  generateEnumRootResolver(FilterOperator),
  generateEnumRootResolver(CaseVisualization),
];

// register each resolver
for (const rootResolvers of rootResolversArray) {
  for (const rootResolverName in rootResolvers) {
    const rootResolverMethod = rootResolvers[rootResolverName];

    if (rootResolverMap.has(rootResolverName)) {
      throw new Error(`Root Resolver for ${rootResolverName} already exists`);
    } else {
      rootResolverMap.set(rootResolverName, rootResolverMethod);
    }
  }
}
