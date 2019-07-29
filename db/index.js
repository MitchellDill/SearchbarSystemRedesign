const { Pool } = require("pg");
const faker = require("faker");
require("dotenv").config();

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGHDATABASE,
  port: process.env.PGPORT,
  max: 50
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

const seedItems = async quantity => {
  for (let i = 0; i < quantity; i++) {
    const fakeItem = faker.fake(
      "{{random.word}} {{name.firstName}} {{hacker.ingverb}} {{name.firstName}}"
    );
    console.log(i + 1);
    const values = [fakeItem];
    const client = await pool.connect();
    try {
      pool.query(`INSERT INTO items (name) VALUES ($1);`, values);
    } finally {
      client.release();
    }
  }
};

seedItems(5000).catch(e => e.stack);

module.exports = { getAllNames, getOneId };
