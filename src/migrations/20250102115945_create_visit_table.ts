import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("visit", (table) => {
    table.increments("id").primary();
    table.string("visit_id", 36).notNullable().unique();
    table.string("session_id", 36).notNullable();
    table.string("ip_address", 45).notNullable();
    table.string("user_agent", 512).nullable();
    table.string("referrer", 1024).nullable();
    table.string("origin", 255).nullable();
    table.string("page", 1024).nullable();
    table.string("timezone", 32).nullable();
    table.string("country", 32).nullable();
    table.string("iso2", 2).nullable();
    table
      .integer("app_id")
      .notNullable()
      .references("id")
      .inTable("app");
    table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now());

    table.index(["session_id", "created_at"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("visit");
}
