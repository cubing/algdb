import { User } from "../../services";
import { generateBaseRootResolvers } from "../../helpers/rootResolver";
import { JomqlRootResolverType } from "jomql";

export default {
  getCurrentUser: new JomqlRootResolverType({
    name: "getCurrentUser",
    restOptions: {
      method: "get",
      route: "/currentUser",
      query: User.presets.default,
    },
    allowNull: false,
    type: User.typeDefLookup,
    resolver: ({ req, fieldPath, args, query }) => {
      if (!req.user?.id) throw new Error("Login required");
      return User.getRecord({
        req,
        fieldPath,
        args: { id: req.user?.id },
        query,
        isAdmin: true,
      });
      // always allow user to get own user
    },
  }),
  ...generateBaseRootResolvers(User, [
    "get",
    "getMultiple",
    "delete",
    "create",
    "update",
  ]),
};
