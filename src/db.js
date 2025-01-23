//import pg from "pg";
const pg = require("pg");

module.exports.pool = new pg.Pool({
  user: "parker_test",
  host: "localhost",
  password: "12345678",
  database: "parker_test",
  port: "5432",
});
