const path = require("path");
const express = require("express");
const xss = require("xss");
const request = require("request");
const StocksService = require("./stocks-service");
const { TWELVEDATA_API_ENDPOINT, TWELVEDATA_API_KEY } = require("../config");

const stocksRouter = express.Router();
const jsonParser = express.json();

const serialize = stocks => ({
  symbol: xss(stocks.symbol),
  name: xss(stocks.name)
});

stocksRouter
  .route("/")
  .get((req, res, next) => {
    // Get an array of all the symbols in stocks table
    StocksService.getAllSymbols(req.app.get("db"))
      .then(data => {
        res.json(data.map(serialize));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    // Add a symbol to the stocks table after getting its time series data
    const { symbol } = req.body;
    if (symbol == null)
      return res.status(400).json({
        error: { message: `Missing 'symbol' in request body` }
      });
    const url = `${TWELVEDATA_API_ENDPOINT}/time_series?symbol=${symbol}&interval=5min&outputsize=5000&apikey=${TWELVEDATA_API_KEY}`;
    // Fetch the company's time series data. On success, atempt to add the comapny and its timeseries
    request(url, { json: true }, (err, r, body) => {
      if (err) {
        next(err);
      }
      const refurl = `${TWELVEDATA_API_ENDPOINT}/stocks?symbol=${symbol}&country=United%20States`;
      request(refurl, { json: true }, (err, r, company) => {
        if (err || company.data.length == 0) {
          next(err);
        }
        const name = company.data[0].name;
        console.log(name);
        StocksService.createStock(
          req.app.get("db"),
          symbol,
          name,
          body.values.map(point => ({
            price: xss(point.close),
            datetime: xss(point.datetime)
          }))
        )
          .then(series => {
            // Respond with the time series just inserted
            res
              .status(201)
              .location(path.posix.join(req.originalUrl, `/${series.id}`))
              .json(series);
          })
          .catch(next);
      });
    });
  });

module.exports = stocksRouter;
