const express = require("express");
const cors = require("cors");
const parser = require("body-parser");
const compression = require("compression");
const db = require("../db");
const elasticDb = require("../db/elasticIndex");

const app = express();

app.use(express.static("dist"));
app.use(express.json());
app.use(parser.json({ strict: false }));
app.use(cors());
app.use(compression());

// middleware for GET routes, implement later
// const sanitizeQuery = (req, res, next) => {
//   const regex = /[\/:.]+/g;
//   const searchTerm = req.query.search.replace(regex, "");
//   req.body.query = searchTerm;
//   next();
// }

app.use("/static", express.static("dist"));

app.get("/items", async (req, res) => {
  const regex = /[\/:.]+/g;
  const term = req.query.search.replace(regex, "");
  console.log("items endpoint says: ", req.query.search);

  // Postgres Route \/
  // const nameRows = await db.getRelevantNames(term);
  // res.send(
  //   nameRows.map(row => {
  //     return row.name;
  //   })
  // );

  const hits = await elasticDb.getRelevantNames(term);
  // res.send(hits);
  console.log(hits);

  res.send(
    hits.map(hit => {
      return hit._source.name;
    })
  );
});

app.post("/items", async (req, res) => {
  const rowId = Number(req.body.id);
  const updateRow = await db.updateRelevance(rowId);
  console.log("post request: ", updateRow);
  res.sendStatus(201);
});

app.get("/find", async (req, res) => {
  console.log("find endpoint says: ", req.query.name);
  const regex = /[\/:.]+/g;
  const productName = req.query.name.replace(regex, "");
  const idRow = await elasticDb.getOneId(productName);
  res.send(idRow);

  // Postgres route \/
  // const idRow = await db.getOneId(productName);
  // res.send([{ productID: idRow.productid }]);
});

app.post("/seeds", async (req, res) => {
  const result = await elasticDb.seedElasticDB(50000);
  console.log(`The seeds be: ${result}`);
  res.send(result);
});

module.exports = { app };
