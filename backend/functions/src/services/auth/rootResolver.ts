import { Auth } from "../services";

import { generateBlankRootResolver } from "../../helpers/tier2/rootResolver";

const rootResolvers = generateBlankRootResolver();

rootResolvers.mutation.loginUser = {
  method: "post",
  route: "loginUser",
  type: Auth.__typename,
  resolver: (req, args, query) => Auth.loginUser(req, args, query),
};

rootResolvers.mutation.socialLogin = {
  method: "post",
  route: "socialLogin",
  type: Auth.__typename,
  resolver: (req, args, query) => Auth.socialLogin(req, args, query),
};

export default rootResolvers;
