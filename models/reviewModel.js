const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    rates: {
      story: {
        type: Number,
        required: false,
        default: null,
        max: [100, "story rate must be below 100"],
        min: [0, "story rate must be above 0"],
      },
      beauty: {
        type: Number,
        required: false,
        default: null,
        max: [100, "beauty rate must be below 100"],
        min: [0, "beauty rate must be above 0"],
      },
      gameplay: {
        type: Number,
        required: false,
        default: null,
        max: [100, "gameplay rate must be below 100"],
        min: [0, "gameplay rate must be above 0"],
      },
      total: {
        type: Number,
        required: [true, "Review must have at least the total rate."],
        max: [100, "total rate must be below 100"],
        min: [0, "total rate must be above 0"],
      },
      text: {
        type: String,
        required: false,
        default: null,
        trim: true,
      },
    },

    game: {
      type: mongoose.Schema.ObjectId,
      ref: "Game",
      require: [true, "Review must belong to a game."],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      require: [true, "Review must belong to a user."],
    },

    addTime: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "game",
    select: "name photo",
  }).populate({
    path: "user",
    select: "name avatar",
  });
  next();
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
