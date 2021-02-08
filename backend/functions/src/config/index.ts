import * as functions from "firebase-functions";

export const isDev = process.env.DEV;

export const env = isDev ? require("../../../env.json") : functions.config();

export const jomqlOptions = {
  debug: !!isDev,
  lookupValue: true,
  jomqlPath: "/jomql",
  processEntireTree: false,
};

export const pgProductionOptions = {
  client: "pg",
  connection: {
    host: env.pg.host,
    user: env.pg.user,
    password: env.pg.password,
    database: env.pg.database,
    ...(env.pg.port && { port: env.pg.port }),
  },
  pool: { min: 0, max: 1 },
};

export const pgDevOptions = env.pg_dev
  ? {
      client: "pg",
      connection: {
        host: env.pg_dev.host,
        user: env.pg_dev.user,
        password: env.pg_dev.password,
        database: env.pg_dev.database,
        ...(env.pg_dev.port && { port: env.pg_dev.port }),
      },
      pool: { min: 0, max: 1 },
    }
  : null;

export const pgOptions = isDev ? pgDevOptions : pgProductionOptions;
