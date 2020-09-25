import { AlgAlgcaseLink } from '../../services';
import * as rootResolverHelper from '../../../helpers/tier2/rootResolver'
import { typeDefs } from '../../typeDefs';

const resolvers = {
  query: {},
  mutation: {},
  subscription: {}
};

rootResolverHelper.generateRootResolvers(resolvers, AlgAlgcaseLink, typeDefs, {
  methods: ["get", "getMultiple", "delete", "update", "create"]
});

export default resolvers;