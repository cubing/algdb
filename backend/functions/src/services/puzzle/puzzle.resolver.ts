import { Puzzle } from '../services';
import { generateRootResolvers } from '../../helpers/tier2/rootResolver'

const resolvers = {
  query: {},
  mutation: {},
  subscription: {}
};

generateRootResolvers(resolvers, Puzzle, {
  methods: ["get", "getMultiple", "delete", "update", "create"]
});

export default resolvers;