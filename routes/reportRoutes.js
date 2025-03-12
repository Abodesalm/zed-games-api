const express = require("express");
const ctrl = require("../controllers/reportCtrl");
const auth = require("./../controllers/authCtrl");

const router = express.Router();

router.route(`/`).get(ctrl.getReports).post(
  auth.protect,
  auth.restrictTo("writer", "admin"),
  //ctrl.uploadGamePhoto,
  //ctrl.resizeGamePhoto,
  ctrl.createReport
);

router
  .route(`/:id`)
  .get(ctrl.getReport)
  .patch(auth.protect, auth.restrictTo("writer", "admin"), ctrl.updateReport)
  .delete(auth.protect, auth.restrictTo("writer", "admin"), ctrl.deleteReport);

module.exports = router;
