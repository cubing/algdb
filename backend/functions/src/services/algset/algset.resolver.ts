import { Algset } from '../services';
import { generateRootResolvers } from '../../helpers/tier2/rootResolver'

const resolvers = {
  query: {},
  mutation: {},
  subscription: {}
};

generateRootResolvers(resolvers, Algset, {
  methods: ["get", "getMultiple", "delete", "update", "create"]
});

export default resolvers;