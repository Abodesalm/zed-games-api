const express = require("express");
const ctrl = require("./../controllers/userCtrl");
const auth = require("./../controllers/authCtrl");
const reviewRouter = require("./../routes/reviewRoutes");

const router = express.Router();

router.use(`/:userId/reviews`, reviewRouter);

router.post("/signup", auth.signup);
router.post("/login", auth.login);

router.post("/forgotPassword", auth.forgotPassword);
router.post("/resetPassword/:token", auth.resetPassword);

router.patch("/updateMyPassword", auth.protect, auth.updatePassword);
router.get("/me", auth.protect, ctrl.getMe, ctrl.getUser);
router.patch("/updateMe", auth.protect, ctrl.updateMe);
router.delete("/deleteMe", auth.protect, ctrl.deleteMe);

router
  .route(`/`)
  .get(ctrl.getUsers)
  .post(auth.protect, auth.restrictTo("admin"), ctrl.addUser);

router
  .route(`/:id`)
  .get(ctrl.getUser)
  .patch(auth.protect, auth.restrictTo("admin"), ctrl.updateUser)
  .delete(auth.protect, auth.restrictTo("admin"), ctrl.deleteUser);

module.exports = router;
