require("dotenv").config();
const { sequelize } = require("./model/database");
const app = require(".");

const PORT = process.env.PORT || 5000;

//* Server
async function start() {
  try {
    await sequelize.authenticate();
    app.listen(PORT, () => {
      console.log("┌─────────────────────────────┐");
      console.log("│ Server:\x1b[92m Online \x1b[0m             │");
      console.log("│ Database:\x1b[92m Online \x1b[0m           │");
      console.log(`│ Port: ${PORT}                  │`);
      console.log(`│ link: http://localhost:${PORT} │`);
      console.log("└─────────────────────────────┘");
    });
  } catch (error) {
    console.log("┌─────────────────────────────┐");
    console.log("│ Server:\x1b[91m Offline \x1b[0m            │");
    console.log("│ Database:\x1b[91m Offline \x1b[0m          │");
    console.log(`│ Port: ${PORT}                  │`);
    console.log(`│ link: -                     │`);
    console.log("└─────────────────────────────┘");
    console.log("Error starting server:\n", error);
  }
}
start();
console.log("Starting server...");
