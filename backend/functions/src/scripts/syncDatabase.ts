import "../schema";
import { objectTypeDefs } from "jomql";
import { typeDef as subscriptionTypeDef } from "../schema/helpers/subscription";
import { MysqlEnv } from "../types";
import { env } from "../config";
import { initializeSequelize, getSequelizeInstance } from "../utils/sequelize";

syncDatabase(env.mysql);

function syncDatabase(
  mysqlEnv: MysqlEnv,
  initSubscriptions = true,
  force = false
) {
  //loop through objectTypeDefs to identify needed mysql tables
  initializeSequelize(mysqlEnv);
  const sequelize = getSequelizeInstance();

  objectTypeDefs.forEach((typeDef, typeKey) => {
    const definition = {};

    for (const prop in typeDef.definition.fields) {
      const sqlDefinition =
        typeDef.definition.fields[prop].mysqlOptions?.sqlDefinition;
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
    sequelize.define("jqlSubscription", subscriptionTypeDef, {
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
