const AppError = require("./../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalide ${err.path} : ${err.value} .`;
  return new AppError(message, 400);
};
const handleValidationDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalide input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
  const x = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value : ${x}. please use another value!`;
  return new AppError(message, 400);
};
const sendErrDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log("\x1b[31m%s\x1b[0m", `ERORR : ${err}`);

    res.status(500).json({
      status: "error",
      message: "something went wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "dev") {
    sendErrDev(err, res);
  } else if (process.env.NODE_ENV === "prod") {
    let error = { ...err };
    if (err.name === "CastError") error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === "ValidationError") error = handleValidationDB(error);
    sendErrProd(error, res);
  }
};
