import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("user", function (t) {
    t.integer("role").notNullable().defaultTo(1).alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("user", function (t) {
    t.string("role").notNullable().defaultTo(1).alter();
  });
}
