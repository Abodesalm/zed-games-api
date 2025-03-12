const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const avatars = require("./../utils/avatars");
const Game = require("./gameModel");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "please write your username!"],
      trim: true,
      unique: [true, "this username is taken!"],
      maxlength: [32, "user name must have less or equal then 32 character"],
      minlength: [2, "user name must have more or equal then 4 character"],
    },
    email: {
      type: String,
      required: [true, "please enter your email!"],
      unique: [true, "this email is already exist!"],
      lowercase: true,
      select: false,
      validate: [validator.isEmail, "please enter a valid email!"],
    },
    role: {
      type: String,
      enum: ["user", "writer", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "please enter a password!"],
      minlength: [8, "password must be more than 8 characters"],
      select: false,
    },
    socials: {
      instagram: {
        type: String,
        default: "-- --",
      },
      steam: {
        type: String,
        default: "-- --",
      },
      discord: {
        type: String,
        default: "-- --",
      },
    },
    tags: {
      type: [String],
    },
    avatar: {
      type: String,
      default: "default.jpg",
      enum: {
        values: avatars,
        message: "avatar must exist",
      },
    },
    bio: {
      type: String,
      default: "",
      maxlength: [200, "bio must be below 200 words"],
    },
    wishlist: {
      type: [mongoose.Schema.Types.ObjectId],
    },
    googleId: String,
    provider: String,
    passwordChangedAt: {
      type: Date,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  this.passConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  //this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPass = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPassAfter = async function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(changedTimestamp);
    console.log(JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.CreatePasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.pre("updateOne", function (next) {
  this.updated_at = Date.now;
  next();
});

/* userSchema.virtual("wishlist", {
  ref: Game,
  foreignField: "user",
  localField: "_id",
}); */

/* userSchema.pre(/^find/, function (next) {
  this.populate({
    path: "wishlist",
    select: "name cover slug",
    model: Game,
  });
  next();
}); */

const User = mongoose.model("user", userSchema);

module.exports = User;
