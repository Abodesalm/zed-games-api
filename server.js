const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");
const mongoose = require("mongoose");

process.on("uncaughtException", (err) => {
  console.log("\x1b[31m%s\x1b[0m", `Uncaught Exception ! Shutting down`);
  console.log("\x1b[30m%s\x1b[0m", `${err.name} : ${err.message}`);
  process.exit(1);
});

const DB = process.env.LOCAL_DATABASE;
/* const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
); */
mongoose
  .connect(DB, {})
  .then(() =>
    console.log("\x1b[36m%s\x1b[0m", "DB Connected Successfully !!!")
  );

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`server is running on ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log("\x1b[31m%s\x1b[0m", `Unhandled Rejection ! Shutting down`);
  console.log("\x1b[30m%s\x1b[0m", `${err.name} : ${err.message}`);
  process.exit(1);
});
