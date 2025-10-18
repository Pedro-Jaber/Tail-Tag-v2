//* Dependencies
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const { Pet } = require("./model/model_pet");
const { User } = require("./model/model_user");

//* Database
const { sequelize } = require("./model/database");

//* App
const app = express();
const PORT = process.env.PORT || 5000;

//* Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    //* Default options
    // origin: "*",
    // methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    // credentials: true,
  })
);

//-* Log Requests
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

//* Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/test", async (req, res) => {
  try {
    const user = await User.create({
      first_name: "Pedro",
      last_name: "Cavalcante",
      email: "lA2a9@example.com",
      search_name: "PEDROCAVALCANTE",
      password: "Aa@123", // must match your password regex
    });

    const pet = await Pet.create({
      name: "Luna",
      collar_serial_number: "123456",
      collar_version: "1.0",
      birthdate: "2022-01-01",
    });

    await user.addPet(pet);

    res.send("User and Pet created with relation!");
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

app.get("/status", (req, res) => {
  res.send("online");
});

//* Server
async function start() {
  try {
    await sequelize.authenticate();
    app.listen(PORT, () => {
      console.log("┌─────────────────────────────┐");
      console.log("│ Server:\x1b[92m Online \x1b[0m             │");
      console.log(`│ Port: ${PORT}                  │`);
      console.log(`│ link: http://localhost:${PORT} │`);
      console.log("└─────────────────────────────┘");
    });
  } catch (error) {
    console.log("┌─────────────────────────────┐");
    console.log("│ Server:\x1b[91m Offline \x1b[0m            │");
    console.log("│ Database:\x1b[91m Offline \x1b[0m          │");
    console.log(`│ Port: ${PORT}                  │`);
    console.log(`│ link:                       │`);
    console.log("└─────────────────────────────┘");
    console.log("Error starting server:\n", error);
  }
}
start();
