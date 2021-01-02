import { AlgAlgcaseLink } from "../../services";
import { generateRootResolvers } from "../../helpers/rootResolver";

export default generateRootResolvers(AlgAlgcaseLink, {
  methods: ["delete", "create"],
});
