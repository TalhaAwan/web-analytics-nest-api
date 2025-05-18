import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('app', (table) => {
    table.increments('id').primary();
    table.string('name', 50).notNullable();
    table.string('domain', 255).notNullable();
    table.string('app_key', 36).notNullable().unique();
    table.string('logo', 255).nullable();
    table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).defaultTo(knex.fn.now());
    table.boolean('deleted').defaultTo(false);
    table.timestamp('deleted_at', { useTz: true }).nullable();
    table.index(['app_key']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('app');
}
