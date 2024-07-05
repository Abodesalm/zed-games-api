const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
// name , email , photo , password , passConfirm

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please tell us your name!"],
    trim: true,
  },

  email: {
    type: String,
    required: [true, "please enter your email!"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "please enter a valid email!"],
  },

  photo: String,

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

  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.modified("password")) return next();

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

const User = mongoose.model("user", userSchema);

module.exports = User;
