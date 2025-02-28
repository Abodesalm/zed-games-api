const Game = require("./../models/gameModel");
const factory = require("./handlerFactory");
const catchAsync = require("./../utils/catchAsync");
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
  console.log(req.file);
  if (!req.file) return next();
  req.file.filename = `game-${Date.now()}.jpeg`;
  sharp(req.file.buffer)
    .resize(600, 900)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/games/${req.file.filename}`);
  next();
};

exports.countGames = catchAsync(async (req, res, next) => {
  const count = (await Game.find().limit(10000).select("name")).length;
  res.status(200).json({
    status: "success",
    data: count,
  });
});

exports.getGames = factory.getAll(Game);

exports.getGame = factory.getOne(Game, {
  path: "reviews",
  select: "-game",
});

exports.createGame = factory.createOne(Game);

exports.updateGame = factory.updateOne(Game);

exports.deleteGame = factory.deleteOne(Game);

/* const redisClient = createClient();
redisClient.on("error", (err) => {
  console.error("REDIS ERROR :", err);
});
(async ()=>{
  await redisClient.connect();
})
 */
exports.getGameOfTheDay = catchAsync(async (req, res) => {
  const today = new Date().toISOString().split("T")[0];

  /*   const cacheKey = `gameOfTheDay-${today}`;
  const cachedGame = await redisClient.get(cacheKey);
  if (cachedGame) {
    return JSON.parse(cachedGame);
  } */
  const games = await Game.find();
  const seed = today;
  const randomIndex = Math.abs(hashCode(seed)) % games.length;
  const game = games[randomIndex];

  /*   await redisClient.set(cacheKey, JSON.stringify(game), { EX: 86400 });
   */
  res.status(200).json({
    status: "success",
    data: {
      data: game,
    },
  });
});
const hashCode = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash;
};
