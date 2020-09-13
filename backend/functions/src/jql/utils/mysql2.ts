const mysql = require('mysql2')
const toUnnamed = require('named-placeholders')();
const { Sequelize } = require('sequelize');

let sequelize, pool, promisePool, isDev;

export default {
  initializeSequelize: async function(mysqlEnv) {
    try {
      sequelize = new Sequelize(mysqlEnv.database, mysqlEnv.user, mysqlEnv.password, {
        ...!mysqlEnv.socketpath && {
          host: mysqlEnv.host,
          port: mysqlEnv.port
        },
        ...mysqlEnv.socketpath && {
          socketPath: mysqlEnv.socketpath
        },
        dialect: "mysql",
      
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
      });
    } catch (err) {
      //console.log(err);
    }
  },

  initializePool: async function(mysqlEnv, debug) {
    try {
      isDev = !!debug;

      pool = await mysql.createPool({
        user: mysqlEnv.user,
        password: mysqlEnv.password,
        database: mysqlEnv.database,
        ...!mysqlEnv.socketpath && {
          host: mysqlEnv.host,
          port: mysqlEnv.port
        },
        ...mysqlEnv.socketpath && {
          socketPath: mysqlEnv.socketpath
        }
      });
      promisePool = pool.promise();
      return pool;
    } catch (err) {
      //console.log(err);
    }
  },
  
  executeDBQuery: async (query, params) => {
    try {
      const q = toUnnamed(query, params);

      if(isDev) {
        console.log(query);
        console.log(params);
      }

      const [results] = await promisePool.query(q[0], q[1]);

      return results;
    } catch(err) {
			throw err;
    }
  },

  getSequelizeInstance() {
    return sequelize;
  },

  getMysqlRaw(rawStatement) {
    return mysql.raw(rawStatement);
  }
};