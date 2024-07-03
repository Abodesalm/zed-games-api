const Game = require("./../models/gameModel");
const APIFeatures = require("./../utils/apifeatures");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.getGames = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Game.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const games = await features.query;

  res.status(200).json({
    status: "success",
    results: games.length,
    data: {
      games,
    },
  });
});

exports.addGame = catchAsync(async (req, res, next) => {
  const newGame = await Game.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      game: newGame,
    },
  });
});

exports.getGame = catchAsync(async (req, res, next) => {
  const game = await Game.findById(req.params.id);
  if (!game) {
    return next(new AppError(`No game found with that ID`, 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      game,
    },
  });
});

exports.editGame = catchAsync(async (req, res, next) => {
  const game = await Game.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!game) {
    return next(new AppError(`No game found with that ID`, 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      game,
    },
  });
});

exports.deleteGame = catchAsync(async (req, res, next) => {
  const game = await Game.findByIdAndDelete(req.params.id);
  if (!game) {
    return next(new AppError(`No game found with that ID`, 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
