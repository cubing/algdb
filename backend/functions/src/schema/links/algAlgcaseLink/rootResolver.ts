import { AlgAlgcaseLink } from "../../services";
import { generateBaseRootResolvers } from "../../helpers/rootResolver";

export default {
  ...generateBaseRootResolvers(AlgAlgcaseLink, [
    "getMultiple",
    "delete",
    "create",
  ]),
};
