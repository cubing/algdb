export { typeDefs } from "./typeDefs";
export { inputDefs } from "./inputDefs";
export * as scalars from "./scalars";

// rootResolvers must come after typeDefs, so typeDefs can be added to services
export { rootResolverMap as rootResolvers } from "./rootResolvers";
