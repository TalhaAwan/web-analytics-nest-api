import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('visit', (table) => {
    table.increments('id').primary();
    table.string('session_id', 36).notNullable(); // Group visits
    table.string('ip_hash', 64).nullable(); // SHA-256 (optional)
    table.string('user_agent', 512).nullable();
    table.string('referrer', 1024).nullable();
    table.string('timezone', 32).nullable();
    table.string('country', 32).nullable();
    table.string('iso2', 2).nullable();
    table.string('browser_language', 16).nullable();
    table.string('screen_resolution', 16).nullable();
    table.string('device_type', 16).nullable(); // "mobile", "desktop", etc.
    table.string('browser', 32).nullable();
    table.string('operating_system', 32).nullable();
    table.boolean('is_bot').defaultTo(false);
    table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp('last_seen_at', { useTz: true }).nullable();
    table.integer('time_spent').nullable(); // in seconds

    table
      .integer('app_id')
      .notNullable()
      .references('id')
      .inTable('app')
      .onDelete('CASCADE');

    table.index(['session_id', 'created_at']);
    table.index(['app_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('visit');
}
