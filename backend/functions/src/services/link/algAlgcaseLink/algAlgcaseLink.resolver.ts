import { AlgAlgcaseLink } from '../../services';
import { generateRootResolvers } from '../../../helpers/tier2/rootResolver'
import { typeDefs } from '../../typeDefs';

const resolvers = {
  query: {},
  mutation: {},
  subscription: {}
};

generateRootResolvers(resolvers, AlgAlgcaseLink, typeDefs, {
  methods: ["get", "getMultiple", "delete", "update", "create"]
});

export default resolvers;