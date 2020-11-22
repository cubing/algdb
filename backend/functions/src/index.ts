import * as functions from "firebase-functions";
import * as express from "express";
import * as admin from "firebase-admin";
admin.initializeApp();

import { initializeJomql } from "jomql";
import * as schema from "./schema";
import { env, isDev } from "./config";

import { initializePusher } from "./helpers/tier1/pusher";
import { handleWebhook, handlePusherAuth } from "./helpers/tier2/subscription";

import { validateToken } from "./helpers/tier1/auth";

const app = express();

//extract the user ID from all requests.
app.use(async function (req: any, res, next) {
  try {
    if (req.headers.authorization) {
      req.user = await validateToken(req.headers.authorization);
    }
  } catch (err) {
    //console.log(err);
  }
  next();
});

// initialize pusher
// env.pusher && initializePusher(env.pusher);

initializeJomql(app, schema, {
  mysqlEnv: env.mysql,
  debug: !!isDev,
  allowedOrigins: [
    "https://alpha.algdb.net",
    "https://ref.algdb.net",
    "http://localhost:3000",
    "https://algdb-ref-client.web.app",
  ],
  lookupValue: true,
  jomqlPath: "/jomql",
  allowSync: false,
});

app.post("/pusher/auth", handlePusherAuth);

app.post("/pusher/webhook", handleWebhook);

export const api = functions.https.onRequest(app);
