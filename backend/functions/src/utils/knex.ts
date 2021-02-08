import * as knexBuilder from "knex";
import { pgOptions, isDev } from "../config";

export const knex = knexBuilder({
  ...pgOptions,
});

export async function executeDBQuery(query, params) {
  try {
    if (isDev) {
      console.log(query);
      console.log(params);
    }

    const results = await knex.raw(query, params);

    return results.rows;
  } catch (err) {
    throw err;
  }
}
