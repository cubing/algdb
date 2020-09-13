import { AlgTagLink } from '../../services';
import { rootResolverHelper } from '../../../jql'
import { typeDefs } from '../../typeDefs';

const resolvers = {
  query: {},
  mutation: {},
  subscription: {}
};

rootResolverHelper.generateRootResolvers(resolvers, AlgTagLink, typeDefs, {
  methods: ["get", "getMultiple", "delete", "create"]
});

export default resolvers;