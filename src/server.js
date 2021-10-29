const app = require("./app");
const poll = require("./poll/poll");
const { PORT, DATABASE_URL } = require("./config");
const knex = require("knex");
const cron = require("node-cron");

// Create and set postgres database to db
const db = knex({
  client: "pg",
  connection: DATABASE_URL
});

app.set("db", db);

// Poll api every 5 min
cron.schedule("*/5 * * * *", () => {
  poll(db);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
