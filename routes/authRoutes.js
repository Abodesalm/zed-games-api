const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const bcrypt = require("bcryptjs");
const catchAsync = require("./../utils/catchAsync");

const router = express.Router();

// Google Oauth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "90d",
    });
    res.json({ token });
  }
);

// Local login
router.post("/local", passport.authenticate("local"), (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
    expiresIn: "90d",
  });
  res.json({ token });
});

// local sign up
router.post(
  "/signup",
  catchAsync(async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      provider: "local",
    });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "90d",
    });
    res.json({ token });
  })
);

module.exports = router;
