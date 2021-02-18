import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("userAlgVoteLink", function (table) {
    table.increments();
    table.integer("user").notNullable();
    table.integer("alg").notNullable();
    table.integer("vote_value").notNullable();
    table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("updated_at").nullable();
    table.integer("created_by").notNullable();
    table.unique(["user", "alg"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("userAlgVoteLink");
}
