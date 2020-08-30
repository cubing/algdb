import resolvers from './services/resolvers';
import { typeDefs } from './services/typeDefs'
import { enums } from './services/enums'
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
    types: {},
    enums: {}
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
      if(!typeDefs[type][prop].hidden) {
        output.types[type][prop] = typeDefs[type][prop].type;
      }
    }
  }

  //add enums
  for(const prop in enums) {
    output.enums[prop] = {};
    
    for(const entry in enums[prop]) {
      //only add property if key is not number
      if(Number.isNaN(parseInt(entry))) {
        output.enums[prop][entry] = enums[prop][entry];
      }
    }
  }
  
  return output;
};