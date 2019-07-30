const express = require("express");
const cors = require("cors");
const parser = require("body-parser");
const compression = require("compression");
const db = require("../db");

const app = express();
const port = 3001;

app.use(express.static("dist"));
app.use(express.json());
app.use(parser.json({ strict: false }));
app.use(cors());
app.use(compression());

app.use("/static", express.static("dist"));

app.get("/items", async (req, res) => {
  const nameRows = await db.getAllNames();
  res.send(
    nameRows.map(row => {
      return row.name;
    })
  );
});

app.post("/find", async (req, res) => {
  const idRow = await db.getOneId(req.body.name);
  res.send([{ productID: idRow.id }]);
});

module.exports = { app, port };
