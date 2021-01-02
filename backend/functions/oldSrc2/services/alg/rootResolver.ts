import { Alg } from "../services";
import { generateRootResolvers } from "../../helpers/tier2/rootResolver";

export default generateRootResolvers(Alg, {
  methods: ["get", "getMultiple", "delete", "create", "update"],
});
