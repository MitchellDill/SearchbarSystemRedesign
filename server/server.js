const express = require("express");
const cors = require("cors");
const parser = require("body-parser");
const compression = require("compression");
const db = require("../db");

const app = express();
const port = process.env.PORT || 3001;

app.use(express.static("dist"));
app.use(express.json());
app.use(parser.json({ strict: false }));
app.use(cors());
app.use(compression());

app.get("/items", (req, res) => {
  db.findAllNames((err, suc) => {
    if (err) console.log(err);
    console.log(suc, "SERVER");

    const results = [];
    for (let i = 0; i < suc.length; i++) {
      results.push(suc[i].name.toLowerCase());
    }
    console.log(results, "should be lower case");
    res.send(results);
  });
});

app.post("/find", (req, res) => {

  db.getSpecificItem({ username: req.body.name }, (err, results) => {
    if (err) console.log("ERRRRR", err);
    res.send(results);
  });
});

app.listen(port, () =>
  console.log(`shenanigans have started on aisle ${port}`)
);
