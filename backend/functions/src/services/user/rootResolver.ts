import { User, Auth } from "../services";
import {
  generateRootResolvers,
  generateBlankRootResolver,
} from "../../helpers/tier2/rootResolver";

const rootResolvers = generateBlankRootResolver();

rootResolvers.query.getCurrentUser = {
  method: "get",
  route: "/currentUser",
  type: User.__typename,
  resolver: (req, args, query) =>
    User.getRecord(req, { id: req.user?.id }, query),
};

/*
// Direct registration not allowed
rootResolvers.mutation.registerUser = {
  method: "post",
  route: "/registerUser",
  type: Auth.__typename,
  resolver: (req, args, query) => User.registerUser(req, args, query),
};
*/

export default generateRootResolvers(
  User,
  {
    methods: ["get", "getMultiple", "delete", "update"],
  },
  rootResolvers
);
