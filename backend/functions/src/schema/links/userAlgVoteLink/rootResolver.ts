import { UserAlgVoteLink } from "../../services";
import { generateBaseRootResolvers } from "../../helpers/rootResolver";

export default {
  ...generateBaseRootResolvers(UserAlgVoteLink, [
    "getMultiple",
    "delete",
    "create",
  ]),
};
