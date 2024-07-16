const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please tell us your name!"],
      trim: true,
      maxlength: [32, "user name must have less or equal then 32 character"],
      minlength: [4, "user name must have more or equal then 4 character"],
    },
    email: {
      type: String,
      required: [true, "please enter your email!"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "please enter a valid email!"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "please enter a password!"],
      minlength: [8, "password must be more than 8 characters"],
      select: false,
    },
    passConfirm: {
      type: String,
      required: [true, "please confirm your password!"],
      validate: {
        // Work Only On Create & Save
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same!",
      },
    },
    passwordChangedAt: {
      type: Date,
      default: 0,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    bio: String,
    avatar: {
      type: String,
      enum: ["av-1", "av-2", "av-3", "av-4", "av-5", "av-6", "av-7", "av-8"],
      default: "av-1",
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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  this.passConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  console.log("\x1b[34m%s\x1b[0m", "User Signed In !");
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

userSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "user",
  localField: "_id",
});

const User = mongoose.model("user", userSchema);

module.exports = User;
