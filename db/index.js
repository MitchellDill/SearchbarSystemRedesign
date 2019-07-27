const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGHDATABASE,
  port: process.env.PGPORT
});

const getOneName = async id => {
  const query = `SELECT name FROM tests WHERE "Id"= $1;`;
  const values = [id];

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
    const { rows } = await pool.query(`SELECT * FROM tests;`);
    console.log(rows);
    return rows;
  } finally {
    client.release();
  }
};

getAllNames().catch(e => e.stack);

module.exports = { getAllNames, getOneName };
