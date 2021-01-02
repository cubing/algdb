import axios from "axios";
import { timeout } from "./shared";
import { env } from "../../config";

const graphqlApi = axios.create({
  baseURL: "https://thecubicleus.myshopify.com/admin/api/2020-10",
});

const restApi = axios.create({
  baseURL:
    "https://" +
    env.shopify.api_user +
    ":" +
    env.shopify.api_key +
    "@thecubicleus.myshopify.com/admin",
});

const shopifyAuthHeaders = {
  "X-Shopify-Access-Token": env.shopify.api_key,
};

export async function sendShopifyGraphqlRequest(graphqlQuery, attempt = 0) {
  if (attempt > 3) {
    throw new Error("Failed 3 times to fetch data, aborting");
  }

  let currentAttempt = attempt;

  const request = {
    headers: shopifyAuthHeaders,
  };

  const params = {
    query: graphqlQuery,
    variables: null,
  };
  const { data } = await graphqlApi.post("/graphql.json", params, request);

  //error response unrelated to throttling, throw error
  if (data.errors && !data.extensions) {
    console.log(JSON.stringify(data.errors));
    throw new Error("Shopify API error response");
  }

  //if data not available, request was probably throttled. retry
  if (!data.data) {
    const cost = data.extensions.cost;
    const ms_to_wait =
      100 +
      (cost.requestedQueryCost - cost.throttleStatus.currentlyAvailable) /
        cost.throttleStatus.restoreRate;

    await timeout(ms_to_wait);

    return sendShopifyGraphqlRequest(graphqlQuery, currentAttempt++);
  } else {
    return data.data;
  }
}

export async function sendShopifyRestRequest(
  method,
  path,
  params,
  attempt = 0
) {
  if (attempt > 3) {
    throw new Error("Failed 3 times to fetch data, aborting");
  }

  const { data } = await restApi[method](path, params);

  return data;
}
