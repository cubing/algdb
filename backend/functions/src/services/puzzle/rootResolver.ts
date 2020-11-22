import { Puzzle } from "../services";
import { generateRootResolvers } from "../../helpers/tier2/rootResolver";

export default generateRootResolvers(Puzzle, {
  methods: ["get", "getMultiple", "delete", "create", "update"],
});
