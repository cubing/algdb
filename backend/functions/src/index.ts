import * as functions from 'firebase-functions';
import * as express from 'express';
import * as admin from 'firebase-admin';
admin.initializeApp();

//utils
import mysql from './utils/mysql2';

import * as jql from "./jql";
import * as schema from "./schema";
import { handleWebhook, handlePusherAuth, typeDef } from "./helpers/tier3/subscription";
import { validateToken } from "./helpers/tier1/auth";

mysql.initializePool();

const app = express();

//extract the user ID from all requests.
app.use(async function(req: any, res, next) {
  try {
    if(req.headers.authorization) {
      req.user = await validateToken(req.headers.authorization);
    }
  } catch(err) {
    console.log(err);
  }
  next();
});

jql.process(app, schema);

app.post('/pusher/auth', handlePusherAuth);

app.post('/pusher/webhook', handleWebhook);

app.post('/mysql/sync', function(req, res) {
  //loop through typeDefs to identify needed mysql tables
  mysql.initializeSequelize();
  const sequelize = mysql.getSequelizeInstance();
  

  for(const type in schema.typeDefs) {
    const definition = {};
    let properties = 0;
    for(const prop in schema.typeDefs[type]) {
      if(prop !== 'id' && schema.typeDefs[type][prop].mysqlOptions?.type) {
        definition[prop] = schema.typeDefs[type][prop].mysqlOptions;
        properties++;
      }
    }
    if(properties > 0) {
      sequelize.define(type, definition, { timestamps: false, freezeTableName: true });
    }
  }

  //define the jql subscription table
  sequelize.define('jqlSubscription', typeDef, { timestamps: false, freezeTableName: true });

  /*
  User.belongsTo(User, {
    foreignKey: 'created_by'
  });
  */
  sequelize.sync({ alter: true }).then(() => {
    console.log("Drop and re-sync db.");
    sequelize.close();
    res.send({});
  });
});

export const api = functions.https.onRequest(app);