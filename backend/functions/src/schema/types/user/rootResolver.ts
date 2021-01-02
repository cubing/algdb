import { User } from "../../services";
import {
  generateRootResolvers,
  generateBlankRootResolver,
} from "../../helpers/rootResolver";

const rootResolvers = generateBlankRootResolver();

rootResolvers.query.getCurrentUser = {
  method: "get",
  route: "/currentUser",
  allowNull: false,
  isArray: false,
  type: User.typename,
  resolver: (req, args, query) =>
    User.getRecord(req, { id: req.user?.id }, query, true),
  // always allow user to get own user
};

// syncs the user's email with their firebase email
rootResolvers.mutation.syncCurrentUser = {
  method: "get",
  allowNull: false,
  isArray: false,
  route: "/syncCurrentUser",
  type: User.typename,
  resolver: (req, args, query) =>
    User.syncRecord(req, { ...args, id: req.user?.id }, query),
};

export default generateRootResolvers(
  User,
  {
    methods: ["get", "getMultiple", "delete", "create", "update"],
  },
  rootResolvers
);
