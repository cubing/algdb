export function generateSchema(schema: any) {
  const output = {
    query: {},
    mutation: {},
    subscription: {},
    types: {},
    enums: {}
  };

  //add the rootschema.resolvers
  for(const type in schema.resolvers) {
    for(const prop in schema.resolvers[type]) {
      output[type][prop] = schema.resolvers[type][prop].type;
    }
  }

  //add the type definitions
  for(const type in schema.typeDefs) {
    output.types[type] = {};
    for(const prop in schema.typeDefs[type]) {
      if(!schema.typeDefs[type][prop].hidden) {
        output.types[type][prop] = schema.typeDefs[type][prop].type;
      }
    }
  }

  //add enums
  for(const prop in schema.enums) {
    output.enums[prop] = {};
    
    for(const entry in schema.enums[prop]) {
      //only add property if key is not number
      if(!entry.match(/^-?\d+$/)) {
        output.enums[prop][entry] = schema.enums[prop][entry];
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

export function generateGraphqlSchema(schema: any) {
  const output = {
    type: {
      Query: {},
      Mutation: {},
      Subscription: {},
    },
    enum: {}
  };

  //add the rootschema.resolvers
  for(const type in schema.resolvers) {
    for(const prop in schema.resolvers[type]) {
      //put args in array
      const argsArray: any = [];
      if(schema.resolvers[type][prop].args) {
        for(const arg in schema.resolvers[type][prop].args) {
          argsArray.push({ key: arg, ...schema.resolvers[type][prop].args[arg] })
        }
      }

      const keyname = prop + "(" + argsArray.map(ele => ele.key + ": " + sanitizeType(ele.type) + (ele.required ? "!" : "")).join(", ") + ")";
      output.type[capitalizeString(type)][keyname] = sanitizeType(schema.resolvers[type][prop].type) + (schema.resolvers[type][prop].allowNull ? "" : "!");
    }
  }

  //add the type definitions
  for(const type in schema.typeDefs) {
    const capitalizedType = capitalizeString(type);
    output.type[capitalizedType] = {};
    for(const prop in schema.typeDefs[type]) {
      if(!schema.typeDefs[type][prop].hidden) {
        //if it has args, process them
        const argsArray: any = [];
        if(schema.typeDefs[type][prop].args) {
          for(const arg in schema.typeDefs[type][prop].args) {
            argsArray.push({ key: arg, ...schema.typeDefs[type][prop].args[arg] });
          }
        }

        const keyname = prop + (argsArray.length ? "(" + argsArray.map(ele => ele.key + ": " + sanitizeType(ele.type) + (ele.required ? "!" : "")).join(", ") + ")": "");
        output.type[capitalizedType][keyname] = sanitizeType(schema.typeDefs[type][prop].type) + (schema.typeDefs[type][prop].allowNull ? "" : "!");
      }
    }
  }

  //add enums
  for(const prop in schema.enums) {
    const capitalizedProp = capitalizeString(prop);

    output.enum[capitalizedProp] = {};
    
    for(const entry in schema.enums[prop]) {
      //only add property if key is not number
      if(!entry.match(/^-?\d+$/)) {
        output.enum[capitalizedProp][entry] = schema.enums[prop][entry];
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