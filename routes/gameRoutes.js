const express = require("express");
const ctrl = require("../controllers/gameCtrl");
const auth = require("./../controllers/authCtrl");
const router = express.Router();

router
  .route(`/`)
  .get(ctrl.getGames)
  .post(auth.protect, auth.restrictTo("admin"), ctrl.addGame);

router
  .route(`/:id`)
  .get(ctrl.getGame)
  .patch(auth.protect, auth.restrictTo("admin"), ctrl.editGame)
  .delete(auth.protect, auth.restrictTo("admin"), ctrl.deleteGame);

module.exports = router;
