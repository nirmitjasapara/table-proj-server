function makeStocksArray() {
  return [
    {
      id: 1,
      symbol: "IBM",
      modified: "2021-05-22T18:46:21.072Z"
    },
    {
      id: 2,
      symbol: "AAPL",
      modified: "2021-05-22T18:46:21.072Z"
    },
    {
      id: 3,
      symbol: "MSFT",
      modified: "2021-05-22T18:46:21.072Z"
    },
    {
      id: 4,
      symbol: "NFLX",
      modified: "2021-05-22T18:46:21.072Z"
    }
  ];
}

function makeTimeSeriesArray(stocks) {
  return [
    {
      id: 10001,
      price: "324.35001",
      datetime: "2021-10-28T22:55:00.000Z",
      stock_id: stocks[3].id
    },
    {
      id: 10002,
      price: "324.25000",
      datetime: "2021-10-28T22:50:00.000Z",
      stock_id: stocks[3].id
    },
    {
      id: 10003,
      price: "323.64999",
      datetime: "2021-10-28T22:45:00.000Z",
      stock_id: stocks[3].id
    },
    {
      id: 10004,
      price: "323.32001",
      datetime: "2021-10-28T22:40:00.000Z",
      stock_id: stocks[3].id
    },
    {
      id: 10005,
      price: "323.56000",
      datetime: "2021-10-28T22:35:00.000Z",
      stock_id: stocks[3].id
    },
    {
      id: 10006,
      price: "323.66000",
      datetime: "2021-10-28T22:30:00.000Z",
      stock_id: stocks[3].id
    },
    {
      id: 10007,
      price: "323.44000",
      datetime: "2021-10-28T22:25:00.000Z",
      stock_id: stocks[3].id
    },
    {
      id: 10008,
      price: "323.48499",
      datetime: "2021-10-28T22:20:00.000Z",
      stock_id: stocks[3].id
    }
  ];
}

function makeStocksFixtures() {
  const testStocks = makeStocksArray();
  const testTimeSeries = makeTimeSeriesArray(testStocks);
  return { testTimeSeries, testStocks };
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx
      .raw(
        `TRUNCATE
        time_series,
        stocks
      `
      )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE stocks_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE time_series_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('stocks_id_seq', 0)`),
          trx.raw(`SELECT setval('time_series_id_seq', 0)`)
        ])
      )
  );
}

function seedStocks(db, stocks) {
  return db
    .into("stocks")
    .insert(stocks)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(`SELECT setval('stocks_id_seq', ?)`, [
        stocks[stocks.length - 1].id
      ])
    );
}

function seedTimeSeriesTable(db, stocks, time_series) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async trx => {
    await seedStocks(trx, stocks);
    await trx.into("time_series").insert(time_series);
    // update the auto sequence to match the forced id values
    await trx.raw(`SELECT setval('time_series_id_seq', ?)`, [
      time_series[time_series.length - 1].id
    ]);
  });
}

function makeExpectedTimeSeries(testStock, time_series) {
  return time_series.filter(p => testStock.id === p.stock_id);
}

module.exports = {
  makeStocksArray,
  makeTimeSeriesArray,

  makeStocksFixtures,
  cleanTables,

  seedTimeSeriesTable,
  seedStocks,

  makeExpectedTimeSeries
};
