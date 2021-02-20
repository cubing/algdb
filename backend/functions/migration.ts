import * as Knex from "knex";

export async function up(knex: Knex): Promise<void[]> {
  return Promise.all([
    knex.schema.createTable("algAlgcaseLink", function (table) {
      table.increments();
      table.integer("alg").notNullable();
      table.integer("algcase").notNullable();
      table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
      table.dateTime("updated_at").nullable();
      table.integer("created_by").notNullable();
      table.unique(["alg", "algcase"]);
    }),
    knex.schema.createTable("algTagLink", function (table) {
      table.increments();
      table.integer("alg").notNullable();
      table.integer("tag").notNullable();
      table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
      table.dateTime("updated_at").nullable();
      table.integer("created_by").notNullable();
      table.unique(["alg", "tag"]);
    }),
    knex.schema.createTable("algUsertagLink", function (table) {
      table.increments();
      table.integer("alg").notNullable();
      table.integer("usertag").notNullable();
      table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
      table.dateTime("updated_at").nullable();
      table.integer("created_by").notNullable();
      table.unique(["alg", "usertag"]);
    }),
    knex.schema.createTable("user", function (table) {
      table.increments();
      table.string("provider").notNullable();
      table.string("provider_id").notNullable();
      table.string("wca_id").nullable();
      table.string("email").notNullable().unique();
      table.string("name").notNullable();
      table.string("avatar").nullable();
      table.string("country").nullable();
      table.boolean("is_public").notNullable().defaultTo(true);
      table.integer("role").notNullable().defaultTo(1);
      table.json("permissions").nullable();
      table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
      table.dateTime("updated_at").nullable();
      table.integer("created_by").notNullable();
      table.unique(["provider", "provider_id"]);
    }),
    knex.schema.createTable("puzzle", function (table) {
      table.increments();
      table.string("name").notNullable();
      table.string("code").notNullable().unique();
      table.boolean("is_public").notNullable().defaultTo(true);
      table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
      table.dateTime("updated_at").nullable();
      table.integer("created_by").notNullable();
    }),
    knex.schema.createTable("algset", function (table) {
      table.increments();
      table.string("name").notNullable();
      table.string("code").notNullable();
      table.integer("parent").nullable();
      table.integer("puzzle").notNullable();
      table.string("mask").nullable();
      table.string("visualization").notNullable().defaultTo("V_2D");
      table.integer("score").notNullable().defaultTo(0);
      table.boolean("is_public").notNullable().defaultTo(true);
      table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
      table.dateTime("updated_at").nullable();
      table.integer("created_by").notNullable();
      table.unique(["code", "parent", "puzzle"]);
    }),
    knex.schema.createTable("algcase", function (table) {
      table.increments();
      table.string("name").notNullable();
      table.integer("algset").notNullable();
      table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
      table.dateTime("updated_at").nullable();
      table.integer("created_by").notNullable();
    }),
    knex.schema.createTable("alg", function (table) {
      table.increments();
      table.string("sequence").notNullable().unique();
      table.boolean("is_approved").notNullable().defaultTo(false);
      table.integer("score").notNullable().defaultTo(0);
      table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
      table.dateTime("updated_at").nullable();
      table.integer("created_by").notNullable();
    }),
    knex.schema.createTable("tag", function (table) {
      table.increments();
      table.string("name").notNullable().unique();
      table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
      table.dateTime("updated_at").nullable();
      table.integer("created_by").notNullable();
    }),
    knex.schema.createTable("usertag", function (table) {
      table.increments();
      table.string("name").notNullable().unique();
      table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
      table.dateTime("updated_at").nullable();
      table.integer("created_by").notNullable();
    }),
    knex.schema.createTable("userAlgVoteLink", function (table) {
      table.increments();
      table.integer("user").notNullable();
      table.integer("alg").notNullable();
      table.integer("vote_value").notNullable();
      table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
      table.dateTime("updated_at").nullable();
      table.integer("created_by").notNullable();
      table.unique(["user", "alg"]);
    }),
  ]);
}

export async function down(knex: Knex): Promise<void[]> {
  return Promise.all([
    knex.schema.dropTable("algAlgcaseLink"),
    knex.schema.dropTable("algTagLink"),
    knex.schema.dropTable("algUsertagLink"),
    knex.schema.dropTable("user"),
    knex.schema.dropTable("puzzle"),
    knex.schema.dropTable("algset"),
    knex.schema.dropTable("algcase"),
    knex.schema.dropTable("alg"),
    knex.schema.dropTable("tag"),
    knex.schema.dropTable("usertag"),
    knex.schema.dropTable("userAlgVoteLink"),
  ]);
}
