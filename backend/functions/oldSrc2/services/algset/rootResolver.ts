import { Algset } from "../services";
import { generateRootResolvers } from "../../helpers/tier2/rootResolver";

export default generateRootResolvers(Algset, {
  methods: ["get", "getMultiple", "delete", "create", "update"],
});
