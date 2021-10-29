const Sequelize = require("sequelize");

const db = require("../config/database");

const User = db.define("user", {
  user_id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  user_name: { type: Sequelize.STRING },
  user_email: { type: Sequelize.STRING },
  user_password: { type: Sequelize.STRING },
  user_image: {
    type: { type: Sequelize.STRING },
    name: { type: Sequelize.STRING },
    data: { type: Sequelize.BLOB("long") },
  },
  total_orders: { type: Sequelize.INTEGER },
  created_at: { type: Sequelize.DATE, default: Date.now },
  last_logged_in: { type: Sequelize.STRING },
});
module.exports = User;
