import { User } from '../services';
import { rootResolverHelper } from '../../jql'
import { typeDefs } from '../typeDefs';

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

rootResolverHelper.generateRootResolvers(resolvers, User, typeDefs, {
  methods: ["get", "getMultiple", "delete", "update"]
});

export default resolvers;