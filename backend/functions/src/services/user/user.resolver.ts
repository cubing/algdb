import { User } from '../services';
import { typeDefs } from '../typeDefs';
import { generateRootResolvers } from '../../helpers/tier2/rootResolver'

const resolvers = {
  query: {
    getCurrentUser: {
      method: "get",
      route: "/currentUser",
      type: User.__typename,
      resolver: (req) => User.getRecord(req, {
        ...req.params,
        ...req.jql?.__args,
        id: req.user?.id
      }, req.jql)
    },
  },
  mutation: {},
  subscription: {}
};

generateRootResolvers(resolvers, User, typeDefs, {
  methods: ["get", "getMultiple", "delete", "update"]
});

export default resolvers;