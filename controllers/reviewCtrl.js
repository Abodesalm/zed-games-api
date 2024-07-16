const Review = require("./../models/reviewModel");
const factory = require("./handlerFactory");

exports.setReviewIds = (req, res, next) => {
  if (!req.body.game) req.body.game = req.params.gameId;
  req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Review);

exports.getReview = factory.getOne(Review);

exports.createReview = factory.createOne(Review);

exports.updateReview = factory.updateOne(Review);

exports.deleteReview = factory.deleteOne(Review);
