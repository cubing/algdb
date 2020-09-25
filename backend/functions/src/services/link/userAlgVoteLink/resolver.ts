import { UserAlgVoteLink } from '../../services';
import * as rootResolverHelper from '../../../helpers/tier2/rootResolver'
import { typeDefs } from '../../typeDefs';

const resolvers = {
  query: {},
  mutation: {
    upsertUserAlgVoteLink: {
      method: "post",
      route: "userAlgVoteLink/upsert",
      type: UserAlgVoteLink.__typename,
      resolver: (req) => UserAlgVoteLink.upsertRecord(req, {
        ...req.params,
        ...req.jql?.__args,
      }, req.jql)
    },
  },
  subscription: {}
};

rootResolverHelper.generateRootResolvers(resolvers, UserAlgVoteLink, typeDefs, {
  methods: ["get", "getMultiple"]
});

export default resolvers;