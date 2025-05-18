import { Knex } from 'knex';

const app_key = process.env.APP_ID;

export async function seed(knex: Knex): Promise<void> {
  await knex('app')
    .select('id')
    .where({ app_key })
    .first()
    .then(
      (row) =>
        row?.id ??
        knex('app')
          .insert({
            name: 'RandomCoords',
            app_key,
            domain: 'www.randomcoords.com',
          })
          .returning('id')
          .then(([newRow]) => newRow.id),
    );
}
