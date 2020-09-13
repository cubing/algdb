import * as functions from 'firebase-functions';
import * as express from 'express';
import * as admin from 'firebase-admin';
admin.initializeApp();

import * as jql from "./jql";
import * as schema from "./schema";

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

jql.process(app, schema, {
  allowedOrigins: ["https://alpha.algdb.net", "http://localhost:3000"],
});

export const api = functions.https.onRequest(app);