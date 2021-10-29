const xss = require("xss");
const request = require("request");
const errorHandler = require("../error-handler");
const PollService = require("./poll-service");
const { TWELVEDATA_API_ENDPOINT, TWELVEDATA_API_KEY } = require("../config");

function poll(db) {
  try {
    // Gets all the symbols from the company and creates a string with comma seperator
    PollService.getAllSymbols(db).then(symbols => {
      const symbolString = symbols.map(obj => obj.symbol).join(",");
      const url = `${TWELVEDATA_API_ENDPOINT}/price?symbol=${symbolString}&apikey=${TWELVEDATA_API_KEY}`;

      // Uses the symbol string to call the api, getting the current price for each symbol
      request(url, { json: true }, (err, r, body) => {
        if (err) {
          throw err;
        }

        // Creates an array of promises for each symbol to add its latest price to the db.
        // Then runs the promises.
        Promise.all(
          Object.keys(body).map(symbol =>
            PollService.addPoint(db, xss(symbol), xss(body[symbol].price))
          )
        ).catch(errorHandler);
      });
    });
  } catch (e) {
    errorHandler(e);
  }
}
module.exports = poll;
