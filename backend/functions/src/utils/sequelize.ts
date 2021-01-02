import type { MysqlEnv } from "../types";
const { Sequelize } = require("sequelize");

let sequelize;

export function initializeSequelize(mysqlEnv: MysqlEnv) {
  sequelize = new Sequelize(
    mysqlEnv.database,
    mysqlEnv.user,
    mysqlEnv.password,
    {
      ...(!mysqlEnv.socketpath && {
        host: mysqlEnv.host,
        port: mysqlEnv.port,
      }),
      ...(mysqlEnv.socketpath && {
        socketPath: mysqlEnv.socketpath,
      }),
      dialect: "mysql",

      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    }
  );
}

export function getSequelizeInstance() {
  return sequelize;
}
