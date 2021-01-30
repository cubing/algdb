import { User } from "../../services";
import { generateBaseRootResolvers } from "../../helpers/rootResolver";
import { JomqlRootResolverType } from "jomql";

export default {
  getCurrentUser: new JomqlRootResolverType({
    name: "getCurrentUser",
    method: "get",
    route: "/currentUser",
    allowNull: false,
    isArray: false,
    type: User.typeDefLookup,
    resolver: ({ req, fieldPath, args, query }) =>
      User.getRecord({
        req,
        fieldPath,
        args: { id: req.user?.id },
        query,
        isAdmin: true,
      }),
    // always allow user to get own user
  }),
  ...generateBaseRootResolvers(User, [
    "get",
    "getMultiple",
    "delete",
    "create",
    "update",
  ]),
};
