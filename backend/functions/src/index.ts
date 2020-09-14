import * as functions from 'firebase-functions';
import * as express from 'express';
import * as admin from 'firebase-admin';
admin.initializeApp();

import * as jql from "jamesql";
import * as schema from "./schema";
import { env, isDev } from "./config";

import { validateToken } from "./helpers/tier1/auth";

const app = express();

//extract the user ID from all requests.
app.use(async function(req: any, res, next) {
  try {
    if(req.headers.authorization) {
      req.user = await validateToken(req.headers.authorization);
    }
  } catch(err) {
    //console.log(err);
  }
  next();
});

jql.initialize(app, schema, {
  mysqlEnv: env.mysql,
  pusherEnv: env.pusher,
  debug: isDev,
  allowedOrigins: ["https://alpha.algdb.net", "http://localhost:3000"],
});

export const api = functions.https.onRequest(app);