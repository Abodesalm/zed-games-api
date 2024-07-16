const Game = require("./../models/gameModel");
const factory = require("./handlerFactory");

exports.getGames = factory.getAll(Game);

exports.getGame = factory.getOne(Game, {
  path: "reviews",
  select: "-game",
});

exports.createGame = factory.createOne(Game);

exports.updateGame = factory.updateOne(Game);

exports.deleteGame = factory.deleteOne(Game);
