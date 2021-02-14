// eslint-disable-next-line @typescript-eslint/no-var-requires
export const env = require("../env.json");

export const production = {
  client: "pg",
  connection: {
    host: env.pg.host,
    user: env.pg.user,
    password: env.pg.password,
    database: env.pg.database,
    ...(env.pg.port && { port: env.pg.port }),
  },
  pool: { min: 0, max: 1 },
  migrations: {
    tableName: "knex_migrations",
    directory: "./db/migrations",
  },
  seeds: {
    directory: "./db/seeds",
  },
};

export const development = {
  client: "pg",
  connection: {
    host: env.pg_dev.host,
    user: env.pg_dev.user,
    password: env.pg_dev.password,
    database: env.pg_dev.database,
    ...(env.pg_dev.port && { port: env.pg_dev.port }),
  },
  pool: { min: 0, max: 1 },
  migrations: {
    tableName: "knex_migrations",
    directory: "./db/migrations",
  },
  seeds: {
    directory: "./db/seeds",
  },
};
