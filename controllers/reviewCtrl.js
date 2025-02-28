const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("./../utils/apifeatures");
const Review = require("./../models/reviewModel");
const AppError = require("./../utils/appError");
const Game = require("./../models/gameModel");
const factory = require("./handlerFactory");

exports.setReviewIds = catchAsync(async (req, res, next) => {
  const check1 = await Game.findById(req.params.gameId);
  const check2 = await Review.find({
    gameId: req.params.gameId,
    userId: req.user.id,
  });
  if (!check1) {
    return next(new AppError(`No Game found with that ID`, 404));
  }
  if (check2.length >= 1) {
    return next(new AppError(`You have already reviewed this game`, 400));
  }
  req.body.gameId = req.params.gameId;
  req.body.userId = req.user.id;

  next();
});

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const params = req.params;
  if (params.gameId) {
    const features = new APIFeatures(
      Review.find({ gameId: params.gameId }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.query;
    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        data: doc,
      },
    });
  } else if (params.userId) {
    const features = new APIFeatures(
      Review.find({
        userId: params.userId,
        /*         gameId: {
          name: {
            $regex: req.query.search || "",
            $options: "i",
          },
        }, */
      }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.query;

    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        data: doc,
      },
    });
  }
});

exports.getReview = factory.getOne(Review);

exports.createReview = factory.createOne(Review);

exports.updateReview = factory.updateOne(Review);

exports.deleteReview = factory.deleteOne(Review);
