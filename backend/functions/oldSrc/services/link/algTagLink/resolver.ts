import { AlgTagLink } from '../../services';
import * as rootResolverHelper from '../../../helpers/tier2/rootResolver'
import { typeDefs } from '../../typeDefs';

const resolvers = {
  query: {},
  mutation: {},
  subscription: {}
};

rootResolverHelper.generateRootResolvers(resolvers, AlgTagLink, typeDefs, {
  methods: ["delete", "create"]
});

export default resolvers;