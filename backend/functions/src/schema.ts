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
      if(!entry.match(/^-?\d+$/)) {
        output.enums[prop][entry] = enums[prop][entry];
      }
    }
  }
  
  return output;
};

function capitalizeString(str: any) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function sanitizeType(val: any) {
  if(Array.isArray(val)) return JSON.stringify(val.map(ele => capitalizeString(ele)));
  else return capitalizeString(val);
}

export function generateGraphqlSchema() {
  const output = {
    type: {
      Query: {},
      Mutation: {},
      Subscription: {},
    },
    enum: {}
  };

  //add the rootResolvers
  for(const type in resolvers) {
    for(const prop in resolvers[type]) {
      //put args in array
      const argsArray: any = [];
      if(resolvers[type][prop].args) {
        for(const arg in resolvers[type][prop].args) {
          argsArray.push({ key: arg, ...resolvers[type][prop].args[arg] })
        }
      }

      const keyname = prop + "(" + argsArray.map(ele => ele.key + ": " + sanitizeType(ele.type) + (ele.required ? "!" : "")).join(", ") + ")";
      output.type[capitalizeString(type)][keyname] = sanitizeType(resolvers[type][prop].type) + (resolvers[type][prop].allowNull ? "" : "!");
    }
  }

  //add the type definitions
  for(const type in typeDefs) {
    const capitalizedType = capitalizeString(type);
    output.type[capitalizedType] = {};
    for(const prop in typeDefs[type]) {
      if(!typeDefs[type][prop].hidden) {
        //if it has args, process them
        const argsArray: any = [];
        if(typeDefs[type][prop].args) {
          for(const arg in typeDefs[type][prop].args) {
            argsArray.push({ key: arg, ...typeDefs[type][prop].args[arg] });
          }
        }

        const keyname = prop + (argsArray.length ? "(" + argsArray.map(ele => ele.key + ": " + sanitizeType(ele.type) + (ele.required ? "!" : "")).join(", ") + ")": "");
        output.type[capitalizedType][keyname] = sanitizeType(typeDefs[type][prop].type) + (typeDefs[type][prop].allowNull ? "" : "!");
      }
    }
  }

  //add enums
  for(const prop in enums) {
    const capitalizedProp = capitalizeString(prop);

    output.enum[capitalizedProp] = {};
    
    for(const entry in enums[prop]) {
      //only add property if key is not number
      if(!entry.match(/^-?\d+$/)) {
        output.enum[capitalizedProp][entry] = enums[prop][entry];
      }
    }
  }
  
  const finalOutput = {};

  for(const prop in output) {
    for(const subprop in output[prop]) {
      finalOutput[prop + " " + subprop] = output[prop][subprop];
    }
  }

  return finalOutput;
};