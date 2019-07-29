const { Pool } = require("pg");
const faker = require("faker");
require("dotenv").config();

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGHDATABASE,
  port: process.env.PGPORT,
  max: 30
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

(async function seedPostgres(loopCountInThousands, rowCount) {
  let client = await pool.connect();
  await client.query(`DROP TABLE IF EXISTS items;`);
  await client.query(`CREATE TABLE items (
    rowId SERIAL,
    productId VARCHAR(8) NOT NULL,
    name VARCHAR(255) NOT NULL  
);`);
  await client.release();

  let outerLoopProgress = 0;

  const createQuery = valuesArr => {
    let query = "INSERT INTO items (productId, name) VALUES";
    for (let i = 0; i < rowCount; i++) {
      const fakeItem = faker.fake("{{name.firstName}} {{hacker.ingverb}}");
      const productId = `${outerLoopProgress + (i + 1)}`
        .toString()
        .padStart(8, "0");
      valuesArr.push(productId);
      valuesArr.push(fakeItem);
      console.log(productId);
      query += `($${i + i + 1}, $${i + i + 2})`;
      if (i !== rowCount - 1) {
        query += ", ";
      }
    }
    return `${query};`;
  };

  for (let i = 0; i < loopCountInThousands; i++) {
    const values = [];
    client = await pool.connect();
    try {
      const query = await createQuery(values);
      await client.query(query, values);
    } catch (e) {
      console.log(e);
    } finally {
      client.release();
    }
    outerLoopProgress += 1000;
  }
})(100, 1000).catch(e => console.log(e.stack));

module.exports = { getAllNames, getOneId };
