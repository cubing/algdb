// initialize the jqlSubscription table within the same database

import { initializeSequelize, getSequelizeInstance } from "jomql";
import { typeDef } from "./helpers/tier2/subscription";
import { env } from "./config";

initializeSequelize(env.mysql);
const sequelize = getSequelizeInstance();

// define the jql subscription table
sequelize.define("jqlSubscription", typeDef, {
  timestamps: false,
  freezeTableName: true,
});

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Done syncing DB");
    sequelize.close();
  })
  .catch((err) => {
    console.log("An error occurred with syncing.");
    console.log(err);
    sequelize.close();
  });
