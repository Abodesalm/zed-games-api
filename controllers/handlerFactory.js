const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/apifeatures");

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // To Allow For Nested GET Reviews on Game and User (HACK)
    let filter = {};
    if (req.params.gameId) filter = { game: req.params.gameId };
    if (req.params.userId) filter = { user: req.params.userId };

    const features = new APIFeatures(
      Model.find({ name: { $regex: req.query.search || "", $options: "i" } }),
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
  });

exports.getOne = (Model, popOptions, select) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    else if (select) query = query.select(select);
    else if (select && popOptions)
      query = query.populate(popOptions).select(select);

    const doc = await query;

    if (!doc) {
      return next(new AppError(`No document found with that ID`, 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (req.file) req.body.photo = req.file.filename;
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (req.file) req.body.photo = req.file.filename;
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError(`No document found with that ID`, 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError(`No document found with that ID`, 404));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  });
