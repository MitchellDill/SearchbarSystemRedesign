const Axios = require("axios");

const db = require("../db");

test("responds to a get request", async () => {
  const results = await Axios.get(
    "http://ec2-18-212-65-184.compute-1.amazonaws.com:3001/items"
  );
  await expect(Promise.resolve(results)).resolves.toHaveProperty("data");
});

// test("all 100 items are returned from the db", async () => {
//   const results = [];
//   const data = await db.findAllNames((err, rows) => {
//     if (err) throw err;
//     results.push(rows.name);
//   });
//   expect(data).toHaveLength(100);
// });
