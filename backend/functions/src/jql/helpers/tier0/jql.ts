import { getTypeDefs } from '../../index';

export default class {
  static validateJsonqlQuery(externalQuery, typename, typeDef = null) {
    const validatedQuery = {};
    const validatedResolvedQuery = {};
    const validatedAggregatedQuery = {};
    const validatedTransformQuery = {};
    const validQuery = typeDef || getTypeDefs()[typename];

    //ensure the id field is there
    if("id" in validQuery) {
      externalQuery.id = null;
    }

    //if the * field is provided, make sure all non-arg, non-hidden fields are there
    if("*" in externalQuery) {
      for(const field in validQuery) {
        if(!validQuery[field].hidden && !validQuery[field].args && !(field in externalQuery)) {
          externalQuery[field] = null;
        }
      }
      delete externalQuery["*"];
    }

    let validFieldsCount = 0;

    for(const field in externalQuery) {
      if(field === "__args") {
        continue;
      }
      
      if(field in validQuery) {
        if(validQuery[field].hidden) {
          throw new Error("Invalid Query");
        }
        
        validFieldsCount++;
        if(validQuery[field].resolver) {
          //if it is a mysql field, fetch the field
          if(validQuery[field].mysqlOptions) {
            validatedQuery[field] = validQuery[field];
          }

          //if a mysql field and field is null, fetch the raw field
          if(validQuery[field].mysqlOptions && externalQuery[field] === null) {
            validatedQuery[field] = {};
          } else {
            //if it has a resolver, put it in the resolvedQueries, along with a copy of the nested query (if any)
            if(validQuery[field].type) {
              //it has a classname, must do further resolving with the external query
              if(externalQuery[field] && typeof externalQuery[field] === "object") {
                validatedResolvedQuery[field] = {
                  resolver: validQuery[field].resolver,
                  externalQuery: externalQuery[field]
                }
              } else {
                //no external query
                validatedResolvedQuery[field] = {
                  resolver: validQuery[field].resolver,
                }
              }
            } else {
              validatedResolvedQuery[field] = {
                resolver: validQuery[field].resolver,
                externalQuery: externalQuery[field]
              };
            }
          }
        } else if(validQuery[field].dataloader) {
          //if it has a dataloader, put it in validatedAggregatedQuery and the validatedQuery

          if(externalQuery[field] === null) {
            validatedQuery[field] = {};
          } else if(typeof externalQuery[field] === "object") {
            validatedQuery[field] = {}; 
            validatedAggregatedQuery[field] = {
              resolver: validQuery[field].dataloader.resolver,
              args: validQuery[field].dataloader.args,
              externalQuery: externalQuery[field]
            }
          }
        } else if(validQuery[field].mysqlOptions?.joinInfo && validQuery[field].type) {
          //joinable field

          //if it is a joinable field, but the external field treats it as non-__typename, fetch only id
          if(externalQuery[field] === null) {
            validatedQuery[field] = {};
          } else if(typeof externalQuery[field] === "object") {
            const validatedFields = this.validateJsonqlQuery(externalQuery[field], validQuery[field].type);
            
            //validate __typename fields
            validatedQuery[field] = {
              ...validQuery[field],
              __nestedQuery: validatedFields.validatedQuery,
            };
    
            validatedResolvedQuery[field] = {
              __typename: validatedFields.validatedResolvedQuery
            };
          } else {
            throw new Error("Invalid query");
          }
        } else {
          //raw field, copy over the typeDef object for this property
          if(externalQuery[field] === null) {
            validatedQuery[field] = validQuery[field];
          } else {
            throw new Error("Invalid query");
          }
        }
      } else {
        throw new Error("Invalid query");
      }
    }

    //must have at least one non-arg field
    if(validFieldsCount < 1) {
      throw new Error("Invalid query");
    }
  
    return {
      validatedQuery,
      validatedAggregatedQuery,
      validatedResolvedQuery
    };
  };

  //handle transformations
  static async handleTransformQueries(obj, resolvedQuery, context, req, args, previous?: Object) {
    for(const field in resolvedQuery) {
      //if there is a transform getter, apply the function
      if(resolvedQuery[field].transform?.getter) {
        obj[field] = resolvedQuery[field]?.transform?.getter(obj[field]);
      }

      //if it has __nested fields, go deeper
      if(resolvedQuery[field].__nestedQuery) {
        await this.handleTransformQueries(obj[field], resolvedQuery[field].__nestedQuery, context, req, args);
      }
    }
  }

  //resolves the queries, and attaches them to the obj (if possible)
  static async handleResolvedQueries(obj, resolvedQuery, context, req, args, previous?: Object) {
    for(const field in resolvedQuery) {
      //if field has a resolver, attempt to resolve and put in obj
      if(resolvedQuery[field].resolver) {

        //if dataloader flag set, fetch the raw field and defer
        if(!resolvedQuery[field].dataloader) {
          obj[field] = await resolvedQuery[field].resolver(context, req, obj, resolvedQuery[field].externalQuery, args, previous);
        }
      } else {
        //if field does not have a resolver, it must be a type. go deeper
        await this.handleResolvedQueries(obj[field], resolvedQuery[field].type, context, req, args, {
          obj, //parent obj
          resolvedQuery,
        });
      }
    }
  }

  static async handleAggregatedQueries(resultsArray, aggregatedQuery, context, req, args, previous?: Object) {
    for(const field in aggregatedQuery) {
      if(aggregatedQuery[field].resolver) {
        const joinSet = new Set();
        //aggregate args
        resultsArray.forEach((result) => {
          joinSet.add(result[field]);
        });

        const aggregatedResults = await aggregatedQuery[field].resolver(context, req, {}, aggregatedQuery[field].externalQuery, { id: [...joinSet] }, previous);

        //build id -> record map
        const recordMap = {};
        aggregatedResults.forEach((result) => {
          recordMap[result.id] = result;
        });
        
        //join the records in memory
        resultsArray.forEach((result) => {
          result[field] = recordMap[result[field]];
        });
      } else {
        //if field does not have a resolver, it must be nested.
        //probably won't ever need this case
      }
    }
  }
};