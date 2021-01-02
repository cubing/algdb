import { Puzzle } from "../../services";
import { generateRootResolvers } from "../../helpers/rootResolver";

export default generateRootResolvers(Puzzle, {
  methods: ["get", "getMultiple", "delete", "create", "update"],
});
