//* Dependencies
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

//* App
const app = express();
const PORT = process.env.PORT || 5000;

//* Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    // origin: "*",
    // methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    // credentials: true,
  })
);
app.use((req, res, next) => {
  // Log route
  console.log(`[${req.method}] ${req.url}`);
  next();
});

//* Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/status", (req, res) => {
  res.send("online");
});

//* Server
app.listen(PORT, () => {
  console.log("┌─────────────────────────────┐");
  console.log("│ Server:\x1b[92m Online \x1b[0m             │");
  console.log(`│ Port: ${PORT}                  │`);
  console.log(`│ link: http://localhost:${PORT} │`);
  console.log("└─────────────────────────────┘");
});
