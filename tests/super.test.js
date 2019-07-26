const request = require("supertest");
const { app } = require("../server/server");

describe("GET /items", () => {
  test("responds with json", () => {
    return request(app)
      .get("/items")
      .expect("Content-Type", /json/);
  });

  test("responds with an array", () => {
    return request(app)
      .get("/items")
      .then(res => {
        expect(JSON.parse(res.text)).toEqual(expect.any(Array));
      });
  });

  test("responds with actual item names from the database", () => {
    const expected = ["KEVIN BENCH", "gotenks"];
    return request(app)
      .get("/items")
      .then(res => {
        expect(JSON.parse(res.text)).toEqual(expect.arrayContaining(expected));
      });
  });
});

describe("POST /find", () => {
  test("responds with a specific name given a product Id", () => {
    return request(app)
      .post("/find")
      .send({ id: 3 })
      .then(res => {
        expect(res.text).toBe("gotenks");
      });
  });
});
