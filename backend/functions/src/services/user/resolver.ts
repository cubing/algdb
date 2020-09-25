import { User } from '../services';
import * as rootResolverHelper from '../../helpers/tier2/rootResolver'
import errorHelper from '../../helpers/tier0/error';
import { typeDefs } from '../typeDefs';

const resolvers = {
  query: {
    getCurrentUser: {
      method: "get",
      route: "/currentUser",
      type: User.__typename,
      resolver: (req) => {
        if(!req.user) throw errorHelper.loginRequiredError();

        return User.getRecord(req, {
          ...req.params,
          ...req.jql?.__args,
          id: req.user?.id
        }, req.jql)
      }
    },
  },
  mutation: {},
  subscription: {}
};

rootResolverHelper.generateRootResolvers(resolvers, User, typeDefs, {
  methods: ["get", "getMultiple", "delete", "update"]
});

export default resolvers;