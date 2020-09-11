import { Tag } from '../services';
import { generateRootResolvers } from '../../helpers/tier2/rootResolver'
import { typeDefs } from '../typeDefs';

const resolvers = {
  query: {},
  mutation: {},
  subscription: {}
};

generateRootResolvers(resolvers, Tag, typeDefs, {
  methods: ["get", "getMultiple", "delete", "create"]
});

export default resolvers;