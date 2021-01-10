import { Alg } from "../../services";
import { generateBaseRootResolvers } from "../../helpers/rootResolver";

export default {
  ...generateBaseRootResolvers(Alg, [
    "get",
    "getMultiple",
    "delete",
    "create",
    "update",
  ]),
};
