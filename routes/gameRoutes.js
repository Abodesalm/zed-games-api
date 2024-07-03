const express = require("express");
const ctrl = require("../controllers/gameCtrl");
const router = express.Router();

router.route(`/`).get(ctrl.getGames).post(ctrl.addGame);

router
  .route(`/:id`)
  .get(ctrl.getGame)
  .patch(ctrl.editGame)
  .delete(ctrl.deleteGame);

module.exports = router;
