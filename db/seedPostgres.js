const { Pool } = require("pg");
const faker = require("faker");

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
  max: 75
});

const seedPostgres = async (loopCountInThousands, rowCount) => {
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
      const fakeItem = faker.fake(
        "{{name.firstName}} {{hacker.ingverb}} {{company.companyName}}"
      );
      const productId = `${outerLoopProgress + (i + 1)}`
        .toString()
        .padStart(8, "0");
      valuesArr.push(productId);
      valuesArr.push(fakeItem);
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
    console.log(i * 1000);
  }
  await pool.end();
};

module.exports = { seedPostgres };
