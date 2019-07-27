const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGHDATABASE,
  port: process.env.PGPORT
});

const getOneId = async name => {
  const query = `SELECT id FROM items WHERE name = $1;`;
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

getAllNames().catch(e => e.stack);

module.exports = { getAllNames, getOneId };
