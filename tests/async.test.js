const Axios = require("axios");
const db = require("../db");

describe("Express Server", () => {
  test("respond to a get request", async () => {
    const results = await Axios.get(
      "http://ec2-18-212-65-184.compute-1.amazonaws.com:3001/items"
    );
    await expect(Promise.resolve(results)).resolves.toHaveProperty("data");
  });
});

// connect a promise-based database first, then return and test integration

// test("all 100 items are returned from the db", async () => {
//   const results = [];
//   await db.findAllNames((err, rows) => {
//     for (let i = 0; i < rows.length; i++) {
//       results.push(rows[i].name);
//     }
//   });
//   await expect(results).toHaveLength(100);
// });
