const stocksService = {
  // SELECT symbol FROM stocks;
  getAllSymbols(knex) {
    return knex.select("symbol", "name").from("stocks");
  },
  // In one transaction insert the symbol into stocks.
  // Then use the generated id for the stock to insert its timeseries.
  // Rollback if any part fails
  createStock(knex, symbol, name, series) {
    // TODO: limit to 120
    return knex.transaction(t => {
      return knex("stocks")
        .transacting(t)
        .insert({ symbol, name })
        .returning("*")
        .then(rows => {
          return rows[0];
        })
        .then(response => {
          return knex("time_series")
            .transacting(t)
            .insert(series.map(point => ({ stock_id: response.id, ...point })))
            .returning("*")
            .then(rows => {
              return { id: response.id, rows };
            });
        })
        .then(t.commit)
        .catch(t.rollback);
    });
  }
};

module.exports = stocksService;
