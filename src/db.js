//import pg from "pg";
const pg = require("pg");
require("dotenv").config();

module.exports.pool = new pg.Pool({
  //user: "parker_test",
  user: "postgres",
  host: "localhost",
  password: process.env.PSQL_SECRET,
  database: "parker_test",
  //database: "postgres",
  port: "5432",
});
