import { Subset } from '../services';
import * as rootResolverHelper from '../../helpers/tier2/rootResolver'
import { typeDefs } from '../typeDefs';

const resolvers = {
  query: {},
  mutation: {},
  subscription: {}
};

rootResolverHelper.generateRootResolvers(resolvers, Subset, typeDefs, {
  methods: ["get", "getMultiple", "delete", "update", "create"]
});

export default resolvers;