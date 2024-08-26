const express = require("express");
const ctrl = require("../controllers/gameCtrl");
const auth = require("./../controllers/authCtrl");
const reviewRouter = require("./../routes/reviewRoutes");

const router = express.Router();

router.route(`/games-count`).get(ctrl.countGames);

router.use(`/:gameId/reviews`, reviewRouter);

router.route(`/`).get(ctrl.getGames).post(
  /* auth.protect, auth.restrictTo("admin"), */
  ctrl.uploadGamePhoto,
  ctrl.resizeGamePhoto,
  ctrl.createGame
);

router
  .route(`/:id`)
  .get(ctrl.getGame)
  .patch(auth.protect, auth.restrictTo("admin"), ctrl.updateGame)
  .delete(auth.protect, auth.restrictTo("admin"), ctrl.deleteGame);

//router.route(`/:gameId/reviews`).post(auth.protect, reviewCtrl.createReview);

module.exports = router;
