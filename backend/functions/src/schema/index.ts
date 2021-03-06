import * as allServices from "./services";
import "./scalars"; // setTypeDef scalars
export * as Scalars from "./scalars";

import user from "./models/user/typeDef";
import auth from "./models/auth/typeDef";
import puzzle from "./models/puzzle/typeDef";
import algset from "./models/algset/typeDef";
import algcase from "./models/algcase/typeDef";
import alg from "./models/alg/typeDef";
import tag from "./models/tag/typeDef";
import usertag from "./models/usertag/typeDef";

import userAlgVoteLink from "./links/userAlgVoteLink/typeDef";

// add the typeDefs for the services with typeDefs
allServices.User.setTypeDef(user);
allServices.Auth.setTypeDef(auth);
allServices.Puzzle.setTypeDef(puzzle);
allServices.Algset.setTypeDef(algset);
allServices.Algcase.setTypeDef(algcase);
allServices.Alg.setTypeDef(alg);
allServices.Tag.setTypeDef(tag);
allServices.Usertag.setTypeDef(usertag);

allServices.UserAlgVoteLink.setTypeDef(userAlgVoteLink);

import User from "./models/user/rootResolver";
import Auth from "./models/auth/rootResolver";
import Puzzle from "./models/puzzle/rootResolver";
import Algset from "./models/algset/rootResolver";
import Algcase from "./models/algcase/rootResolver";
import Alg from "./models/alg/rootResolver";
import Tag from "./models/tag/rootResolver";
import Usertag from "./models/usertag/rootResolver";

import AlgAlgcaseLink from "./links/algAlgcaseLink/rootResolver";
import AlgTagLink from "./links/algTagLink/rootResolver";
import AlgUsertagLink from "./links/algUsertagLink/rootResolver";
import UserAlgVoteLink from "./links/userAlgVoteLink/rootResolver";

allServices.User.setRootResolvers(User);
allServices.Auth.setRootResolvers(Auth);
allServices.Puzzle.setRootResolvers(Puzzle);
allServices.Algset.setRootResolvers(Algset);
allServices.Algcase.setRootResolvers(Algcase);
allServices.Alg.setRootResolvers(Alg);
allServices.Tag.setRootResolvers(Tag);
allServices.Usertag.setRootResolvers(Usertag);

allServices.AlgAlgcaseLink.setRootResolvers(AlgAlgcaseLink);
allServices.AlgTagLink.setRootResolvers(AlgTagLink);
allServices.AlgUsertagLink.setRootResolvers(AlgUsertagLink);
allServices.UserAlgVoteLink.setRootResolvers(UserAlgVoteLink);
