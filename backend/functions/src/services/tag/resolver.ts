import { Tag } from '../services';
import { rootResolverHelper } from 'jomql'
import { typeDefs } from '../typeDefs';

const resolvers = {
  query: {},
  mutation: {},
  subscription: {}
};

rootResolverHelper.generateRootResolvers(resolvers, Tag, typeDefs, {
  methods: ["get", "getMultiple", "delete", "create"]
});

export default resolvers;