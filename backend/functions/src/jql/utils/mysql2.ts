import { env, isDev } from '../../helpers/tier0/config';
const mysql = require('mysql2')
const toUnnamed = require('named-placeholders')();
const { Sequelize } = require('sequelize');

let sequelize, pool, promisePool;

export default {
  initializeSequelize: async function() {
    try {
      sequelize = new Sequelize(env.mysql.database, env.mysql.user, env.mysql.password, {
        ...!env.mysql.socketpath && {
          host: env.mysql.host,
          port: env.mysql.port
        },
        ...env.mysql.socketpath && {
          socketPath: env.mysql.socketpath
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

  initializePool: async function() {
    try {
      pool = await mysql.createPool({
        user: env.mysql.user,
        password: env.mysql.password,
        database: env.mysql.database,
        ...!env.mysql.socketpath && {
          host: env.mysql.host,
          port: env.mysql.port
        },
        ...env.mysql.socketpath && {
          socketPath: env.mysql.socketpath
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