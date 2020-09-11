import { UserAlgTagLink } from '../../services';
import { generateRootResolvers } from '../../../helpers/tier2/rootResolver'
import { typeDefs } from '../../typeDefs';

const resolvers = {
  query: {},
  mutation: {},
  subscription: {}
};

generateRootResolvers(resolvers, UserAlgTagLink, typeDefs, {
  methods: ["get", "getMultiple", "getFirst", "delete", "update", "create"]
});

export default resolvers;