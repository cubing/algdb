import { Algcase } from "../../services";
import { generateRootResolvers } from "../../helpers/rootResolver";

export default generateRootResolvers(Algcase, {
  methods: ["get", "getMultiple", "delete", "create", "update"],
});
