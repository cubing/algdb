import { Tag } from "../../services";
import { generateBaseRootResolvers } from "../../helpers/rootResolver";

export default {
  ...generateBaseRootResolvers(Tag, ["get", "getMultiple", "delete", "create"]),
};
