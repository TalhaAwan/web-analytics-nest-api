import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('page_view', (table) => {
    table.increments('id').primary();
    table
      .integer('visit_id')
      .notNullable()
      .references('id')
      .inTable('visit')
      .onDelete('CASCADE');
    table.string('path', 1024).notNullable();
    table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());

    table.index(['visit_id', 'created_at']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('page_view');
}
