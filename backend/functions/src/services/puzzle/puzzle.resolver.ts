import { Puzzle } from '../services';
import { generateRootResolvers } from '../../helpers/tier2/rootResolver'
import { typeDefs } from '../typeDefs';

const resolvers = {
  query: {
    getPuzzleByCode: {
      method: "get",
      route: "/puzzlebycode/:code",
      type: Puzzle.__typename,
      resolver: (req) => Puzzle.getRecordByCode(req, {
        ...req.query,
        ...req.params,
        ...req.jql?.__args,
      }, req.jql)
    },
  },
  mutation: {},
  subscription: {}
};

generateRootResolvers(resolvers, Puzzle, typeDefs, {
  methods: ["get", "getMultiple", "getFirst", "delete", "update", "create"]
});

export default resolvers;