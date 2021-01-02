import * as allServices from "./services";
import { TypeDefinition } from "jomql";
import {
  NormalService,
  PaginatedService,
  SimpleService,
} from "./core/services";

import user from "./types/user/typeDef";
import auth from "./types/auth/typeDef";
import puzzle from "./types/puzzle/typeDef";
import algset from "./types/algset/typeDef";
import algcase from "./types/algcase/typeDef";
import alg from "./types/alg/typeDef";
import algAlgcaseLink from "./links/algAlgcaseLink/typeDef";

// add the typeDefs for the services with typeDefs
allServices.User.typeDef = user;
allServices.Auth.typeDef = auth;
allServices.Puzzle.typeDef = puzzle;
allServices.Algset.typeDef = algset;
allServices.Algcase.typeDef = algcase;
allServices.Alg.typeDef = alg;
allServices.AlgAlgcaseLink.typeDef = algAlgcaseLink;

// build the typeDef Map
const typeDefs: Map<string, TypeDefinition> = new Map();

for (const serviceName in allServices) {
  const service = allServices[serviceName];

  if (service instanceof NormalService || service instanceof SimpleService) {
    if (service.typeDef) {
      typeDefs.set(service.typename, service.typeDef);
    } else {
      throw new Error(`Service missing typeDef: ${serviceName}`);
    }
  }

  if (service instanceof PaginatedService) {
    typeDefs.set(service.paginator.typename, service.paginator.typeDef);
  }
}

export { typeDefs };
