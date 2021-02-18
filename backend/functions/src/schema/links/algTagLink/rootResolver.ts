import { AlgTagLink } from "../../services";
import { generateBaseRootResolvers } from "../../helpers/rootResolver";

export default {
  ...generateBaseRootResolvers(AlgTagLink, ["getMultiple", "delete", "create"]),
};
