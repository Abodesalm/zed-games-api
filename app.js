const express = require("express");
const morgan = require("morgan");
const AppError = require("./utils/appError");
const GEH = require("./controllers/errorCtrl");
const app = express();
const ver = "v1";
const gamesRouter = require("./routes/gameRoutes");

if (process.env.NODE_ENV === "dev") {
  app.use(morgan("dev"));
}
app.use(express.json());

app.use(`/api/${ver}/games`, gamesRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(GEH);

module.exports = app;
