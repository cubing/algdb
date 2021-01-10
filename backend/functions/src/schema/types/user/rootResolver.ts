import { User } from "../../services";
import { generateBaseRootResolvers } from "../../helpers/rootResolver";

export default {
  getCurrentUser: {
    method: "get",
    route: "/currentUser",
    allowNull: false,
    isArray: false,
    type: User.typename,
    resolver: (req, args, query) =>
      User.getRecord(req, { id: req.user?.id }, query, true),
    // always allow user to get own user
  },
  ...generateBaseRootResolvers(User, [
    "get",
    "getMultiple",
    "delete",
    "create",
    "update",
  ]),
};
