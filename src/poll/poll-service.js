const pollService = {
  // SELECT symbol FROM stocks;
  getAllSymbols(knex) {
    return knex.select("symbol").from("stocks");
  },
  // WITH stock_id AS (SELECT id FROM stocks WHERE symbol = $1)
  // INSERT INTO time_series (stock_id, price) VALUES (stock_id, $2)
  addPoint(knex, symbol, price) {
    return knex("stocks")
      .select("id")
      .where("symbol", symbol)
      .then(response => {
        return knex("time_series")
          .insert({ price, stock_id: response[0].id })
          .returning("*")
          .then(rows => {
            return { id: response.id, rows };
          });
      });
  }
};

module.exports = pollService;
