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
      const downscaled = data.map(serialize).filter((d, i) => {
        const date = new Date(d.datetime);
        return date.getHours() >= 15 && date.getMinutes() > 50;
      });
      console.log(downscaled);
      res.json(downscaled);
    })
    .catch(next);
});

module.exports = timeSeriesRouter;
