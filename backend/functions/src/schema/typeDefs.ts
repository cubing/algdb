// build the typeDef Map first
export const typeDefs: Map<string, TypeDefinition> = new Map();

import * as allServices from "./services";
import { TypeDefinition } from "jomql";

import user from "./types/user/typeDef";
import auth from "./types/auth/typeDef";
import puzzle from "./types/puzzle/typeDef";
import algset from "./types/algset/typeDef";
import algcase from "./types/algcase/typeDef";
import alg from "./types/alg/typeDef";
import tag from "./types/tag/typeDef";

// add the typeDefs for the services with typeDefs
allServices.User.initialize(user);
allServices.Auth.initialize(auth);
allServices.Puzzle.initialize(puzzle);
allServices.Algset.initialize(algset);
allServices.Algcase.initialize(algcase);
allServices.Alg.initialize(alg);
allServices.Tag.initialize(tag);
