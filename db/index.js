const mysql = require("mysql");
require("dotenv").config();

const con = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.NAME,
  password: process.env.PASS,
  database: process.env.NAME
});

con.connect(function(err) {
  if (err) throw err;
  console.log(process.env.HOST, "HOST");
  console.log("Connected database!");
});

// going to get names for each item.
// going to move all names to react array in order to filter for autofilling functionality
const findAllNames = cb => {
  // placeholder //put in .escape(user) format instead of ${}
  con.query(`Select items.name from items`, (err, results) => {
    if (err) cb(err);
    cb(null, results);
  });
};

const getSpecificItem = (item, cb) => {
  con.query(
    `select * from items where items.name='${item.username}'`,
    (err, results) => {
      if (err) cb(err);
      cb(null, results);
    }
  );
};

module.exports = { findAllNames, getSpecificItem };
