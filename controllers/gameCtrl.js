const Game = require("./../models/gameModel");
const factory = require("./handlerFactory");
const catchAsync = require("./../utils/catchAsync");
const allGenres = require("./../utils/genres");
const sharp = require("sharp");
const multer = require("multer");

/* const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img/games");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `game-${req.body.id}-${Date.now()}.${ext}`);
  },
}); */
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cd(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
exports.uploadGamePhoto = upload.single("photo");
exports.resizeGamePhoto = (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `game-${Date.now()}.jpeg`;
  sharp(req.file.buffer)
    .resize(400, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/games/${req.file.filename}`);
  next();
};
/* 
exports.getGames = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) - 1 || 0;
  const limit = 16;
  const search = req.query.search || "";
  let sort = req.query.sort || "addTime";
  let genre = req.query.genre || "all";

  genre === "all"
    ? (genre = [...allGenres])
    : (genre = req.query.genre.split(","));
  req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

  let sortBy = {};
  if (sort[1]) {
    sortBy[sort[0]] = sort[1];
  } else {
    sortBy[sort[0]] = "asc";
  }

  const games = await Game.find({
    name: { $regex: search, $options: "i", $in: [...genre] },
  })
    .where("genres")
    .in([...genre])
    .sort(sortBy)
    .skip(page * limit)
    .limit(limit);

  const total = await Game.countDocuments({
    genre: { $in: [...genre] },
    name: { $regex: search, $options: "i" },
  });

  res.status(200).json({
    status: "success",
    results: games.length,
    page: page + 1,
    data: { data: games },
  });
}); */

exports.getGames = factory.getAll(Game);

exports.getGame = factory.getOne(Game, {
  path: "reviews",
  select: "-game",
});

exports.createGame = factory.createOne(Game);

exports.updateGame = factory.updateOne(Game);

exports.deleteGame = factory.deleteOne(Game);
