const AppError = require("../utils/appError");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");
const APIFeatures = require("./../utils/apifeatures");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
exports.updateMe = catchAsync(async (req, res, next) => {
  //1) create error if user POSTs password data
  if (req.body.password)
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword",
        400
      )
    );
  console.log(req.body);
  //2) update user document
  const filteredBody = filterObj(
    req.body,
    "username",
    "avatar",
    "bio",
    "socials",
    "tags"
  );
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

//
//
//

exports.getUserByName = catchAsync(async (req, res, next) => {
  let user = await User.findOne({ username: { $eq: req.params.name } }).select(
    "username bio avatar tags socials"
  );
  if (!user) {
    return next(new AppError(`No user found with this Username`, 404));
  }
  res.status(200).json({
    status: "success",
    data: user,
  });
});
exports.getNormalUsers = catchAsync(async (req, res, next) => {
  let featuring = new APIFeatures(
    User.find({
      username: {
        $regex: req.query.search || "",
        $options: "i",
      },
    }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  let users = await featuring.query;

  res.status(200).json({
    status: "success",
    data: { data: users },
  });
});

exports.getUsers = factory.getAll(User);

exports.getUser = factory.getOne(User, {}, "_id username socials tags avatar");

exports.addUser = factory.createOne(User);

exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);
