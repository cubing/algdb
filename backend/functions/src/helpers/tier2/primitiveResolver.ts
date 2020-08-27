import jqlHelper from '../../jql/helpers/jsonql';

import firestoreHelper from '../tier1/firestore';

export default class {
  static async resolveTableRows(context, req, jqlQuery, args = <any> {}) {
    //validate graphql
    const validatedGraphql = jqlHelper.validateJsonqlQuery(jqlQuery.select, context.__typename);

    jqlQuery.select = validatedGraphql.validatedQuery;

    //fetch the firestore record
    const data = await firestoreHelper.db.collection(context.__typename).doc(args.id+"").get().then(res => res.data());

    //if not found, return empty array
    if(!data) {
      return [];
    }

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