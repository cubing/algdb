import * as schema from "../schema";
import { Schema } from "jomql";
import { typeDef } from "../schema/helpers/subscription";
import { MysqlEnv } from "../types";
import { env } from "../config";
import { initializeSequelize, getSequelizeInstance } from "../utils/sequelize";

syncDatabase(env.mysql, schema);

function syncDatabase(
  mysqlEnv: MysqlEnv,
  schema: Schema,
  initSubscriptions = true,
  force = false
) {
  //loop through typeDefs to identify needed mysql tables
  initializeSequelize(mysqlEnv);
  const sequelize = getSequelizeInstance();

  schema.typeDefs.forEach((typeDef, typeKey) => {
    const definition = {};

    for (const prop in typeDef) {
      const sqlDefinition =
        typeDef[prop].customOptions?.mysqlOptions?.sqlDefinition;
      if (prop !== "id" && sqlDefinition) {
        definition[prop] = sqlDefinition;
      }
    }

    if (Object.keys(definition).length > 0) {
      sequelize.define(typeKey, definition, {
        timestamps: false,
        freezeTableName: true,
      });
    }
  });

  if (initSubscriptions)
    // define the jql subscription table
    sequelize.define("jqlSubscription", typeDef, {
      timestamps: false,
      freezeTableName: true,
    });

  return sequelize
    .sync({ [force ? "force" : "alter"]: true })
    .then(() => {
      console.log("Done syncing DB");
      sequelize.close();
    })
    .catch((err) => {
      console.log("An error occurred with syncing.");
      console.log(err);
      sequelize.close();
    });
}
