const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT
});

pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

const getOneName = async () => {
  const client = await pool.connect();
  try {
    const { rows } = await pool.query(`SELECT * FROM tests;`);
    console.log(`tests: ${rows[0].name}`);
    return rows[0].name;
  } finally {
    client.release();
  }
};

const getAllNames = async () => {
  const client = await pool.connect();
  try {
    const { rows } = await pool.query(`SELECT * FROM tests limit 1;`);
    console.log(`tests: ${rows}`);
    return rows;
  } finally {
    client.release();
  }
};

getAllNames().catch(e => console.log(e.stack));

//   // async/await - check out a client
//   async () => {
//     const client = await pool.connect()
//     try {
//       const res = await client.query('SELECT * FROM users WHERE id = $1', [1])
//       console.log(res.rows[0])
//     } finally {
//       client.release()
//     }
//   }
// )()
// .catch(e => console.log(e.stack))

// // going to get names for each item.
// // going to move all names to react array in order to filter for autofilling functionality
// const findAllNames = cb => {
//   // placeholder //put in .escape(user) format instead of ${}
//   con.query(`Select items.name from items`, (err, results) => {
//     if (err) cb(err);
//     cb(null, results);
//   });
// };

// const getSpecificItem = (item, cb) => {
//   con.query(
//     `select * from items where items.name='${item.username}'`,
//     (err, results) => {
//       if (err) cb(err);
//       cb(null, results);
//     }
//   );
// };

module.exports = { getAllNames, getOneName };
