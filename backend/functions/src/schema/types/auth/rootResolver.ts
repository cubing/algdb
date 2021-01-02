import { Auth } from "../../services";

import { generateBlankRootResolver } from "../../helpers/rootResolver";
import { BaseScalars } from "jomql";

const rootResolvers = generateBlankRootResolver();

/*
// using firebase auth. login logic happens on the frontend
rootResolvers.mutation.loginUser = {
  method: "post",
  route: "loginUser",
  type: Auth.typename,
  isArray: false,
  allowNull: false,
  resolver: (req, args, query) => Auth.loginUser(req, args, query),
};
*/

rootResolvers.mutation.socialLogin = {
  method: "post",
  route: "/socialLogin",
  type: Auth.typename,
  isArray: false,
  allowNull: false,
  args: {
    type: {
      fields: {
        provider: { type: BaseScalars.string, required: true },
        code: { type: BaseScalars.string, required: true },
        redirect_uri: { type: BaseScalars.string, required: true },
      },
    },
  },
  resolver: (req, args, query) => Auth.socialLogin(req, args, query),
};

export default rootResolvers;
