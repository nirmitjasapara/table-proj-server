module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL:
    process.env.DATABASE_URL || "postgresql://user@localhost/tabledb",
  TEST_DATABASE_URL:
    process.env.TEST_DATABASE_URL || "postgresql://user@localhost/tabledb-test",
  TWELVEDATA_API_ENDPOINT: "https://api.twelvedata.com",
  TWELVEDATA_API_KEY: process.env.TWELVEDATA_API_KEY
};
