import { Tag } from '../services';
import { generateRootResolvers } from '../../helpers/tier2/rootResolver'

const resolvers = {
  query: {},
  mutation: {},
  subscription: {}
};

generateRootResolvers(resolvers, Tag, {
  methods: ["get", "getMultiple", "delete", "update", "create"]
});

export default resolvers;