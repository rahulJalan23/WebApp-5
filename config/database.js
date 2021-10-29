const Sequelize = require("sequelize");

var db = new Sequelize("myFirstDb", "root", "rahuljalan", {
  host: "localhost",
  dialect: "mysql",

  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
});

db.authenticate()
  .then(console.log("working sequealize"))
  .catch((err) => {
    console.log(err);
  });

module.exports = db;
