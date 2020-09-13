import { UserAlgTagLink } from '../../services';
import { rootResolverHelper } from '../../../jql'
import { typeDefs } from '../../typeDefs';

const resolvers = {
  query: {},
  mutation: {},
  subscription: {}
};

rootResolverHelper.generateRootResolvers(resolvers, UserAlgTagLink, typeDefs, {
  methods: ["get", "getMultiple", "delete", "update", "create"]
});

export default resolvers;