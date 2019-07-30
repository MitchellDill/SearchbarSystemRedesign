const { Pool } = require("pg");
const faker = require("faker");
require("dotenv").config();
const { seedPostgres } = require("./seedPostgres");

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGHDATABASE,
  port: process.env.PGPORT
});

pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

const getOneId = async name => {
  const query = `SELECT ProductId FROM items WHERE name = $1;`;
  const values = [name];

  const client = await pool.connect();
  try {
    const { rows } = await pool.query(query, values);
    return rows[0];
  } finally {
    client.release();
  }
};

const getAllNames = async () => {
  const client = await pool.connect();
  try {
    const { rows } = await pool.query(`SELECT * FROM items;`);
    console.log(rows);
    return rows;
  } finally {
    client.release();
  }
};

// seedPostgres(10000, 1000).catch(e => console.log(e.stack));

module.exports = { getAllNames, getOneId };
