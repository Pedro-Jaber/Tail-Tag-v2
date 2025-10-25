const Sequelize = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST,
  // port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false,
});

const syncDatabase = async () => {
  await sequelize.sync({ alter: true });
  // await sequelize.sync({ force: true });
};

module.exports = {
  Sequelize,
  sequelize,
  syncDatabase,
};
