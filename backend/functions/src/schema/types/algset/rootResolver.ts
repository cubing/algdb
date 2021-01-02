import { Algset } from "../../services";
import { generateRootResolvers } from "../../helpers/rootResolver";

export default generateRootResolvers(Algset, {
  methods: ["get", "getMultiple", "delete", "create", "update"],
});
