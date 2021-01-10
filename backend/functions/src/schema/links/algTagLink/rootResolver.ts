import { AlgTagLink } from "../../services";
import { generateBaseRootResolvers } from "../../helpers/rootResolver";

export default {
  ...generateBaseRootResolvers(AlgTagLink, ["delete", "create"]),
};
