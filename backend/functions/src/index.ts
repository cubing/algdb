import * as functions from "firebase-functions";
import * as express from "express";

import { initializeJomql } from "jomql";
import "./schema";
import { env, jomqlOptions } from "./config";

import { initializePusher } from "./utils/pusher";
import { handlePusherAuth } from "./helpers/pusher";
import { validateToken } from "./helpers/auth";
import { CustomSchemaGenerator } from "./helpers/schema";

const app = express();

const allowedOrigins = [
  "https://alpha.algdb.net",
  "https://ref.algdb.net",
  "http://localhost:3000",
  "https://algdb-ref-client.web.app",
];

// extract the user ID from all requests.
app.use(async function (req, res, next) {
  try {
    if (req.headers.authorization) {
      req.user = await validateToken(req.headers.authorization);
    }

    // handle origins -- only accepting string type origins.
    const origin =
      Array.isArray(allowedOrigins) && allowedOrigins.length
        ? typeof req.headers.origin === "string" &&
          allowedOrigins.includes(req.headers.origin)
          ? req.headers.origin
          : allowedOrigins[0]
        : "*";

    res.header("Access-Control-Allow-Origin", origin);
    if (origin !== "*") {
      res.header("Vary", "Origin");
    }

    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "PUT, POST, GET, DELETE, OPTIONS"
    );
  } catch (err) {
    console.log(err);
  }
  next();
});

app.options("*", function (req, res, next) {
  res.header("Access-Control-Max-Age", "86400");
  res.sendStatus(200);
});

// initialize pusher
env.pusher && initializePusher(env.pusher);

initializeJomql(app, jomqlOptions);

app.get("/schema.ts", function (req, res, next) {
  const tsSchemaGenerator = new CustomSchemaGenerator(jomqlOptions);
  tsSchemaGenerator.buildSchema();
  tsSchemaGenerator.processSchema();
  res.send(tsSchemaGenerator.outputSchema());
});

export const api = functions.https.onRequest(app);

app.post("/pusher/auth", handlePusherAuth);
