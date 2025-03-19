# Web Analytics Nest

This project contains a nest application to record and show web analytics.

## Prerequisite

- node >= v20.15.0
- npm >= 10.7.0
- postgress database - ensure there's a database by the ename of `analytics` (or the name of your choice)

## Initialize & run the project

- clone the repository and change directory to `web-analytics-nestjs`
- add `.env` file in the root and add the required variables:

```
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=analytics
DB_PASS=12345678
DB_PORT=5432
```

- `npm i`
- `npm run migrate:latest` (runs the knex migrations to add tables)
- `npm run seed:run` (seeds initial data for testing)
- `npm run start:dev` (starts the project at port 3000)

## APIs

TBD
