const express = require("express");
const xss = require("xss");
const TimeSeriesService = require("./time-series-service");

const timeSeriesRouter = express.Router();

const serialize = point => ({
  price: xss(point.price),
  datetime: xss(point.datetime)
});

// Use the provided symbol to send back the time series data.
timeSeriesRouter.route("/:symbol").get((req, res, next) => {
  // TODO: down sampling of data
  TimeSeriesService.getTimeSeries(req.app.get("db"), req.params.symbol)
    .then(data => {
      res.json(data.map(serialize));
    })
    .catch(next);
});

module.exports = timeSeriesRouter;
