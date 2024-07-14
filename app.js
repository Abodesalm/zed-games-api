const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

// express-mongo-sanitize   xss-clean   express-rate-limit    hpp

const AppError = require("./utils/appError");
const GEH = require("./controllers/errorCtrl");
const app = express();
const ver = "v1";
const gamesRouter = require("./routes/gameRoutes");
const usersRouter = require("./routes/userRoutes");

// 1) GLOBAL MIDDLEWARE

// set security HTTP headers
app.use(helmet());

// log requests infos for Dev
if (process.env.NODE_ENV === "dev") app.use(morgan("dev"));

// limit requests from same IP
const limiter = rateLimit({
  max: 400,
  windowMs: 60 * 60 * 1000,
  message: "too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ["xxxx"],
  })
);

// body parser , reading data from body into req.body
app.use(express.json({ limit: "25kb" }));

app.use(`/api/${ver}/games`, gamesRouter);
app.use(`/api/${ver}/users`, usersRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(GEH);

module.exports = app;
