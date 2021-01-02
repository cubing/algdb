import { syncDatabase } from "jomql";
import * as schema from "./schema";
import { env } from "./config";

syncDatabase(env.mysql, schema);
