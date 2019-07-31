const { Pool } = require("pg");
require("dotenv").config();

const { seedPostgres } = require("./seedPostgres");

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
  max: 50
});

pool.on("error", err => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

const getOneId = async name => {
  const query = `SELECT ProductId FROM items WHERE name = $1;`;
  const values = [name];

  const client = await pool.connect();
  try {
    const { rows } = await pool.query(query, values);
    console.log(rows);
    return rows[0];
  } finally {
    client.release();
  }
};

const getRelevantNames = async term => {
  const query = `SELECT * FROM items WHERE name LIKE $1 ORDER BY relevance DESC LIMIT 30;`;
  const values = [`${term}%`];

  const client = await pool.connect();
  try {
    const { rows } = await client.query(query, values);
    return rows;
  } finally {
    client.release();
  }
};

const updateRelevance = async id => {
  const query = `UPDATE items SET relevance = relevance + 1 WHERE RowId = $1 RETURNING productId, relevance;`;
  const values = [id];

  const client = await pool.connect();
  try {
    const { rows } = await client.query(query, values);
    return rows;
  } finally {
    client.release();
  }
};

// seedPostgres(10000, 1000).catch(e => console.log(e.stack));

module.exports = { getRelevantNames, getOneId, updateRelevance };
