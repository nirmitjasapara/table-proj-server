# Table Proj Server

### GET `/api/stocks/`

Returns the symbols of all the Stocks the database is tracking.

```js

// res.body
[
  symbol: String
]
```

### POST `/api/stocks/`

Creates a new stock to track if the limit of 120 is not met. Requires the symbol of the company.

```js
// req.body
{
  symbol: String
}

// res.body
{
  id: ID,
  price: String,
  datetime: DateTime,
  stock_id: StockId
}
```

### GET `/api/time-series/:symbol`

Returns the time series of the symbol provided.

```js
// req.params
{
  symbol: String
}
// res.body
[
  price: String,
  datetime: DateTime
]
```

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

## Create local

- `pg_ctl -D /usr/local/var/postgres start` if not started yet (Mac)
- `createuser -Pw --interactive` if user has not yet been created

1. `createdb -U user_name tabledb`
2. `npm run migrate`

## Setup for running tests

- `pg_ctl -D /usr/local/var/postgres start` if not started yet (Mac)
- `createuser -Pw --interactive` if user has not yet been created

2. `createdb -U user_name tabledb-test`
3. `npm run migrate:test`

## Tear Down

1. `npm run migrate -- 0`
2. `dropdb db_name`
3. `pg_ctl stop`

## Heroku

1. `heroku create`
2. `heroku addons:create heroku-postgresql:hobby-dev`
3. `heroku config:set JWT_SECRET=paste-your-token-here`
4. `npm run deploy`

- Set scale to free: `heroku ps:scale web=1`
- If problems with verification: `heroku config:set PGSSLMODE=no-verify.`

## Technology Stack

### Backend

- **Express** for handling API requests
- **Node** for interacting with the file system
- **Knex.js** for interfacing with the **PostgreSQL** database
- **Postgrator** for database migration
- **Mocha**, **Chai**, **Supertest** for endpoints testing
- **Xss** for cross-site scripting protection
- **Winston**, **Morgan** for logging and errors
- **node-cron** for polling the Api
