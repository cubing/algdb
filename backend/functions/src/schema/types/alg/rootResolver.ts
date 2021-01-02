import { Alg } from "../../services";
import { generateRootResolvers } from "../../helpers/rootResolver";

export default generateRootResolvers(Alg, {
  methods: ["get", "getMultiple", "delete", "create", "update"],
});
