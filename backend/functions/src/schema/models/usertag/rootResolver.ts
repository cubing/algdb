import { Usertag } from "../../services";
import { generateBaseRootResolvers } from "../../helpers/rootResolver";

export default {
  ...generateBaseRootResolvers(Usertag, [
    "get",
    "getMultiple",
    "delete",
    "create",
  ]),
};
