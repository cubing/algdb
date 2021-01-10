import { Algcase } from "../../services";
import { generateBaseRootResolvers } from "../../helpers/rootResolver";

export default {
  ...generateBaseRootResolvers(Algcase, [
    "get",
    "getMultiple",
    "delete",
    "create",
    "update",
  ]),
};
