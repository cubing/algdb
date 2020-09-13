import { pusher } from '../tier1/pusher';

import sharedHelper from '../tier0/shared';

import * as mysqlHelper from '../tier1/mysql';

import { DataTypes } from "sequelize";

export async function handleJqlSubscription(req, operationName, args, query) {
  //check subscriptions table
  const subscriptionResults = await mysqlHelper.executeDBQuery("SELECT id, channel FROM jqlSubscription WHERE user = :user AND operation = :operation AND args = :args", {
    user: req.user.id,
    operation: operationName,
    args: JSON.stringify(args)
  });

  let channel = 'private-';

  if(subscriptionResults.length < 1) {
    const channelName = sharedHelper.generateRandomString(20);

    //add new entry
    await mysqlHelper.executeDBQuery("INSERT INTO jqlSubscription SET user = :user, operation = :operation, args = :args, query = :query, channel = :channel", {
      user: req.user.id,
      operation: operationName,
      args: JSON.stringify(args),
      query: JSON.stringify(query),
      channel: channelName
    })

    channel += channelName;
  } else {
    //entry exists, update the query
    await mysqlHelper.executeDBQuery("UPDATE jqlSubscription SET query = :query WHERE id = :id", {
      query: JSON.stringify(query),
      id: subscriptionResults[0].id
    })

    channel += subscriptionResults[0].channel
  }

  return channel;
}

export async function handleJqlSubscriptionTrigger(req, service, operationName, args) {
  const subscriptionResults = await mysqlHelper.executeDBQuery("SELECT id, user, args, query, channel FROM jqlSubscription WHERE operation = :operation AND args = :args", {
    operation: operationName,
    args: JSON.stringify(args)
  });

  const promises = <any>[];

  for(const item of subscriptionResults) {
    //fetch the requested data
    const simulatedReq = {
      user: {
        id: item.user
      }
    };
    promises.push(service.getRecord(simulatedReq, JSON.parse(item.args), JSON.parse(item.query)).then(data => {
      pusher.trigger('private-' + item.channel, 'subscription-data', {
        'data': data
      });
    }).catch(e => e));
  }

  return Promise.all(promises);
}

export async function handleJqlSubscriptionTriggerIterative(req, service, operationName, args, moreArgs) {
  //fetch all subscriptions with the relevant operationName
  const subscriptionResults = await mysqlHelper.executeDBQuery("SELECT id, user, args, query, channel FROM jqlSubscription WHERE operation = :operation", {
    operation: operationName
  });

  const promises = <any>[];

  loop1:
  for(const item of subscriptionResults) {
    const itemArgs = JSON.parse(item.args);
    
    //check if the subscription args match the object that was just created
    for(const arg in args) {
      if(itemArgs[arg] && itemArgs[arg] !== args[arg]) {
        //skip this item if the args are not a valid match
        continue loop1;
      }
    }

    //fetch the requested data
    const simulatedReq = {
      user: {
        id: item.user
      }
    };
    promises.push(service.getRecord(simulatedReq, { ...itemArgs, ...moreArgs }, JSON.parse(item.query)).then(data => {
      pusher.trigger('private-' + item.channel, 'subscription-data', {
        'data': data
      });
    }).catch(e => console.log(e)));
  }

  return Promise.all(promises);
}

export async function deleteJqlSubscription(req, operationName, args) {
  return mysqlHelper.executeDBQuery("DELETE FROM jqlSubscription WHERE args = :args AND operation = :operation", {
    operation: operationName,
    args: JSON.stringify(args)
  });
}

export function handleWebhook(req, res) {
  req.body.events.forEach(event => {
    if(event.name === "channel_vacated") {
      //delete table rows where channel == channel
      mysqlHelper.executeDBQuery("DELETE FROM jqlSubscription WHERE channel = :channel", {
        channel: event.channel.replace(/^private-/, '')
      });
    }
  });

  res.send({});
}

export function handlePusherAuth(req: any, res) {
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;

  let presenceData = <any> null;

  if(channel.match(/^presence-/)) {
    if(req.user) {
      presenceData = {
        user_id: req.user.id,
        user_info: {
          name: 'Mr Channels',
          twitter_id: '@pusher'
        }
      };
    }
  }
  const auth = pusher.authenticate(socketId, channel, presenceData);
  res.send(auth);
}

export const typeDef = {
  user: {
    type: DataTypes.INTEGER
  },
  operation: {
    type: DataTypes.STRING
  },
  args: {
    type: DataTypes.STRING
  },
  query: {
    type: DataTypes.TEXT
  },
  channel: {
    type: DataTypes.STRING
  }
};