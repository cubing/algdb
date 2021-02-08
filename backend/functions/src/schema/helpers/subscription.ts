import { getPusher } from "../../utils/pusher";
import { NormalService } from "../core/services";

import * as randomstring from "randomstring";

import * as sqlHelper from "./sql";

export async function handleJqlSubscription(
  req,
  operationName: string,
  args,
  query
) {
  //check subscriptions table
  const subscriptionResults = await sqlHelper.executeDBQuery(
    "SELECT id, channel FROM jqlSubscription WHERE user = :user AND operation = :operation AND args = :args",
    {
      user: req.user.id,
      operation: operationName,
      args: JSON.stringify(args),
    }
  );

  let channel = "private-";

  if (subscriptionResults.length < 1) {
    const channelName = randomstring.generate(20);

    //add new entry
    await sqlHelper.executeDBQuery(
      "INSERT INTO jqlSubscription SET user = :user, operation = :operation, args = :args, query = :query, channel = :channel",
      {
        user: req.user.id,
        operation: operationName,
        args: JSON.stringify(args),
        query: JSON.stringify(query),
        channel: channelName,
      }
    );

    channel += channelName;
  } else {
    //entry exists, update the query
    await sqlHelper.executeDBQuery(
      "UPDATE jqlSubscription SET query = :query WHERE id = :id",
      {
        query: JSON.stringify(query),
        id: subscriptionResults[0].id,
      }
    );

    channel += subscriptionResults[0].channel;
  }

  return channel;
}

export async function handleJqlSubscriptionTrigger(
  req,
  service: NormalService,
  operationName: string,
  args: object
) {
  const subscriptionResults = await sqlHelper.executeDBQuery(
    "SELECT id, user, args, query, channel FROM jqlSubscription WHERE operation = :operation AND args = :args",
    {
      operation: operationName,
      args: JSON.stringify(args),
    }
  );

  const promises = <any>[];

  for (const item of subscriptionResults) {
    //fetch the requested data
    const simulatedReq = {
      user: {
        id: item.user,
      },
    };
    /*
    promises.push(
      service
        .getRecord({
          req: simulatedReq, args: JSON.parse(item.args), query: JSON.parse(item.query)
        })
        .then((data) => {
          getPusher().trigger("private-" + item.channel, "subscription-data", {
            data: data,
          });
        })
        .catch((e) => e)
    );
    */
  }

  return Promise.all(promises);
}

export async function handleJqlSubscriptionTriggerIterative(
  req,
  service: NormalService,
  operationName: string,
  mutatedItemArgs, //compared against subscriptionArgs
  lookupItemArgs //used to lookup the item
) {
  //fetch all subscriptions with the relevant operationName
  const subscriptionResults = await sqlHelper.executeDBQuery(
    "SELECT id, user, args, query, channel FROM jqlSubscription WHERE operation = :operation",
    {
      operation: operationName,
    }
  );

  const promises = <any>[];

  loop1: for (const item of subscriptionResults) {
    const subscriptionArgs = JSON.parse(item.args);

    //filter out subscriptions based on the subscriptionArgs and the item's args.
    for (const arg in mutatedItemArgs) {
      if (
        subscriptionArgs[arg] &&
        subscriptionArgs[arg] !== mutatedItemArgs[arg]
      ) {
        //skip this item if the args are not a valid match (however, is OK if subscriptionArgs are missing)
        continue loop1;
      }
    }

    //fetch the requested data
    const simulatedReq = {
      user: {
        id: item.user,
      },
    };

    /*
    promises.push(
      service
        .getRecord(simulatedReq, lookupItemArgs, JSON.parse(item.query))
        .then((data) => {
          getPusher().trigger("private-" + item.channel, "subscription-data", {
            data: data,
          });
        })
        .catch((e) => e)
    );
    */
  }

  return Promise.all(promises);
}

export async function deleteJqlSubscription(
  req,
  operationName: string,
  args: object
) {
  return sqlHelper.executeDBQuery(
    "DELETE FROM jqlSubscription WHERE args = :args AND operation = :operation",
    {
      operation: operationName,
      args: JSON.stringify(args),
    }
  );
}

export const typeDef = {
  user: {
    type: "integer",
  },
  operation: {
    type: "string",
  },
  args: {
    type: "string",
  },
  query: {
    type: "text",
  },
  channel: {
    type: "string",
  },
};
