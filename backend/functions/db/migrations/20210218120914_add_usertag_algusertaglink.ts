import * as Knex from "knex";

export async function up(knex: Knex): Promise<void[]> {
  return Promise.all([
    knex.schema.createTable("algUsertagLink", function (table) {
      table.increments();
      table.integer("alg").notNullable();
      table.integer("usertag").notNullable();
      table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
      table.dateTime("updated_at").nullable();
      table.integer("created_by").notNullable();
      table.unique(["alg", "usertag"]);
    }),
    knex.schema.createTable("usertag", function (table) {
      table.increments();
      table.string("name").notNullable().unique();
      table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
      table.dateTime("updated_at").nullable();
      table.integer("created_by").notNullable();
    }),
  ]);
}

export async function down(knex: Knex): Promise<void[]> {
  return Promise.all([
    knex.schema.dropTable("algUsertagLink"),
    knex.schema.dropTable("usertag"),
  ]);
}
