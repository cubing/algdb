import { Puzzle } from "../../services";
import { generateBaseRootResolvers } from "../../helpers/rootResolver";

export default {
  ...generateBaseRootResolvers(Puzzle, [
    "get",
    "getMultiple",
    "delete",
    "create",
    "update",
  ]),
};
