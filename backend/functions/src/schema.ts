import resolvers from './services/resolvers';
import { typeDefs } from './services/typeDefs'
export { typeDefs } from './services/typeDefs'

export const rootResolvers = resolvers;

//populate allRootResolvers
export const allRootResolvers = {};

for(const resolverType in rootResolvers) {
  for(const prop in rootResolvers[resolverType]) {
    allRootResolvers[prop] = rootResolvers[resolverType][prop];
  }
}

export function generateSchema() {
  const output = {
    query: {},
    mutation: {},
    subscription: {},
    types: {}
  };

  //add the rootResolvers
  for(const type in resolvers) {
    for(const prop in resolvers[type]) {
      output[type][prop] = resolvers[type][prop].type;
    }
  }

  //add the type definitions
  for(const type in typeDefs) {
    output.types[type] = {};
    for(const prop in typeDefs[type]) {
      output.types[type][prop] = typeDefs[type][prop].type;
    }
  }
  
  return output;
};