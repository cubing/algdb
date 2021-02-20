import { AlgUsertagLink } from "../../services";
import { generateBaseRootResolvers } from "../../helpers/rootResolver";

export default {
  ...generateBaseRootResolvers(AlgUsertagLink, [
    "getMultiple",
    "delete",
    "create",
  ]),
};
