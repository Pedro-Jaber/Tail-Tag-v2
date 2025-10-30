//* Dependencies
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const { Pet } = require("./model/model_pet");
const { User } = require("./model/model_user");

const userRouter = require("./router/router_user");
const petRouter = require("./router/router_pet");

//* Database
const { syncDatabase } = require("./model/database");

(async () => {
  await syncDatabase();
  console.log("Banco sincronizado!");
})();

//* App
const app = express();

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

//* Log Requests
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

//* Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/pets", petRouter);

app.get("/test", async (req, res) => {
  try {
    const user = await User.create({
      first_name: "Pedro",
      last_name: "Cavalcante",
      email: "lA2a9@example.com",
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

module.exports = app;
