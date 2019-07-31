const express = require("express");
const cors = require("cors");
const parser = require("body-parser");
const compression = require("compression");
const db = require("../db");

const app = express();

app.use(express.static("dist"));
app.use(express.json());
app.use(parser.json({ strict: false }));
app.use(cors());
app.use(compression());

app.use("/static", express.static("dist"));

app.get("/items", async (req, res) => {
  const regex = /[\/:.]+/g;
  const term = req.query.search.replace(regex, "");
  console.log("items endpoint says: ", req.query.search);
  const nameRows = await db.getRelevantNames(term);
  res.send(
    nameRows.map(row => {
      return row.name;
    })
  );
});

app.get("/find", async (req, res) => {
  console.log("find endpoint says: ", req.query.name);
  const regex = /[\/:.]+/g;
  const productName = req.query.name.replace(regex, "");
  const idRow = await db.getOneId(productName);
  res.send([{ productID: idRow.productid }]);
});

module.exports = { app };
