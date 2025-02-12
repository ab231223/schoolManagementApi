const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/school");

const db = mongoose.connection;

db.once("open", (err) => {
  if (err) {
    console.log("Something Is Wrong", err);
    return false;
  }
  console.log("DB Connected successfully");
});

module.exports = db;
