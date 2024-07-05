const express = require("express");
const ctrl = require("./../controllers/userCtrl");
const auth = require("./../controllers/authCtrl");

const router = express.Router();

router.post("/signup", auth.signup);
router.post("/login", auth.login);

router.post("/forgotPassword", auth.forgotPassword);
router.post("/resetPassword/:token", auth.resetPassword);
router.patch("/updateMyPassword", auth.protect, auth.updatePassword);

router.patch("/updateMe", auth.protect, ctrl.updateMe);
router.delete("/deleteMe", auth.protect, ctrl.deleteMe);
/* 
router.route(`/`).get(ctrl.getUsers).post(ctrl.addUser);

router
  .route(`/:id`)
  .get(ctrl.getUser)
  .patch(ctrl.editUser)
  .delete(ctrl.deleteUser);
 */
module.exports = router;
