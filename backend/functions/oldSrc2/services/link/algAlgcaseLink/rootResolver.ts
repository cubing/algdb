import { AlgAlgcaseLink } from "../../services";
import { generateRootResolvers } from "../../../helpers/tier2/rootResolver";

export default generateRootResolvers(AlgAlgcaseLink, {
  methods: ["delete", "create"],
});
