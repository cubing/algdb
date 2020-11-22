import { UserAlgTagLink } from '../../services';
import * as rootResolverHelper from '../../../helpers/tier2/rootResolver'
import { typeDefs } from '../../typeDefs';

const resolvers = {
  query: {},
  mutation: {},
  subscription: {}
};

rootResolverHelper.generateRootResolvers(resolvers, UserAlgTagLink, typeDefs, {
  methods: ["delete", "update", "create"]
});

export default resolvers;