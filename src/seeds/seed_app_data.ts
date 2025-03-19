import { Knex } from "knex";

const application_id = "b3b8ef66-f015-4d98-a4b5-8f63580eb498";

export async function seed(knex: Knex): Promise<void> {
  await knex("app")
    .select("id")
    .where({ application_id })
    .first()
    .then((row) =>
      row?.id ??
      knex("app")
        .insert({
          name: "RandomCoords",
          application_id,
          app_key: application_id,
          domain: "www.randomcoords.com"
        })
        .returning("id")
        .then(([newRow]) => newRow.id)
    );
}
