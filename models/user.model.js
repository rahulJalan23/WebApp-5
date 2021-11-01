const { STRING } = require("sequelize");
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
  user_email: { type: Sequelize.STRING, unique: true },
  user_password: { type: Sequelize.STRING },
  user_image: { type: Sequelize.STRING },
  total_orders: { type: Sequelize.INTEGER, defaultValue: 0 },
  created_at: { type: Sequelize.DATE, defaultValue: Date.now },
  last_logged_in: { type: Sequelize.DATE, defaultValue: Date.now },
});
module.exports = User;
