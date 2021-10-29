const timeSeriesService = {
  // SELECT * FROM stocks INNER JOIN time_series ON stocks.id = time_series.stock_id WHERE symbol = $1
  getTimeSeries(knex, symbol) {
    return knex
      .from("stocks")
      .join("time_series", "stocks.id", "time_series.stock_id")
      .select("*")
      .where("symbol", symbol);
  }
};

module.exports = timeSeriesService;
