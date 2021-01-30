import { Algset } from "../../services";
import { generateBaseRootResolvers } from "../../helpers/rootResolver";

export default {
  ...generateBaseRootResolvers(Algset, [
    "get",
    "getMultiple",
    "delete",
    "create",
    "update",
  ]),
};
