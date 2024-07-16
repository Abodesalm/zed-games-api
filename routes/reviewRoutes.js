const express = require("express");
const ctrl = require("./../controllers/reviewCtrl");
const auth = require("./../controllers/authCtrl");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(ctrl.getAllReviews)
  .post(auth.protect, ctrl.setReviewIds, ctrl.createReview);
router
  .route("/:id")
  .get(ctrl.getReview)
  .patch(auth.protect, ctrl.updateReview)
  .delete(auth.protect, ctrl.deleteReview);

module.exports = router;
