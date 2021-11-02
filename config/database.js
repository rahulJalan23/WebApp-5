const Sequelize = require("sequelize");

var db = new Sequelize({
  dialect: "sqlite",
  storage: "data.sqlite3",
});

db.authenticate()
  .then(console.log("working sequealize"))
  .catch((err) => {
    console.log(err);
  });
// db.sync();
module.exports = db;
