const mongoose = require("mongoose");
const User = require("./userModel");
const Game = require("./gameModel");

const reviewSchema = new mongoose.Schema(
  {
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Review must belong to a game."],
      ref: "Game",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Review must belong to a user."],
      ref: "User",
    },

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
      general: {
        type: Number,
        required: [true, "Review must have at least the general rate."],
        max: [100, "total rate must be below 100"],
        min: [0, "total rate must be above 0"],
      },
    },
    texts: {
      story: String,
      beauty: String,
      gameplay: String,
      general: String,
      short: String,
    },
    created_at: {
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
    path: "gameId",
    select: "name cover",
    model: Game,
  }).populate({
    path: "userId",
    select: "username avatar",
    model: User,
  });
  next();
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
