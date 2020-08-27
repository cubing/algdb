import jqlHelper from '../../jql/helpers/jsonql';

export default class {
  static async resolveTableRows(context, req, jqlQuery, args = <any> {}, typeDef = <any> {}) {
    //validate graphql
    const validatedGraphql = jqlHelper.validateJsonqlQuery(jqlQuery.select, null, typeDef);

    const data = {};

    //put the requested fields into results
    const results = {
      __typename: context.__typename
    };

    for(const field in data) {
      if(field in validatedGraphql.validatedQuery || field in validatedGraphql.validatedResolvedQuery) {
        results[field] = data[field];
      }
    }

    const returnArray = [results];

    //handle resolved fields
    for(const returnObject of returnArray) {
      await jqlHelper.handleResolvedQueries(returnObject, validatedGraphql.validatedResolvedQuery, context, req, args);
    }

    //handle aggregated fields
    await jqlHelper.handleAggregatedQueries(returnArray, validatedGraphql.validatedAggregatedQuery, context, req, args);
    return returnArray;
  }
};