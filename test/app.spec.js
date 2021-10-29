const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");
const xss = require("xss");

describe("Stocks Endpoints", function() {
  let db;

  const { testTimeSeries, testStocks } = helpers.makeStocksFixtures();

  const serializeStock = stock => ({
    symbol: xss(stock.symbol)
  });

  const serializeTimeSeries = point => ({
    price: xss(point.price),
    datetime: new Date(xss(point.datetime)).toString()
  });

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => helpers.cleanTables(db));

  afterEach("cleanup", () => helpers.cleanTables(db));

  beforeEach("insert time series", () =>
    helpers.seedTimeSeriesTable(db, testStocks, testTimeSeries)
  );

  describe(`GET /api/stocks`, () => {
    context(`Given no stocks`, () => {
      it(`responds with 200 and an empty list`, () => {
        helpers.cleanTables(db);
        return supertest(app)
          .get("/api/stocks")
          .expect(200, []);
      });
    });

    context("Given there are stocks in the database", () => {
      it("responds with 200 and all of the stocks", () => {
        return supertest(app)
          .get("/api/stocks")
          .expect(200, testStocks.map(serializeStock));
      });
    });
  });
  describe(`GET /api/time-series/:symbol`, () => {
    context(`Given no data-points`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get("/api/time-series/ghts")
          .expect(200, []);
      });
    });

    context("Given the symbol has time series data", () => {
      it("responds with 200 and all of the stocks", () => {
        const testStock = testStocks[3];
        return supertest(app)
          .get("/api/time-series/" + testStock.symbol)
          .expect(
            200,
            helpers
              .makeExpectedTimeSeries(testStock, testTimeSeries)
              .map(serializeTimeSeries)
          );
      });
    });
  });
});
