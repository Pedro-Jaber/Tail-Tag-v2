const { Router } = require("express");
const userController = require("../controller/controller_user");

const router = Router();

// User
router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createOrUpdate);

router.route("/restore/:id").put(userController.restoreUser);

router
  .route("/:id")
  .get(userController.getById)
  .put(userController.createOrUpdate)
  .delete(userController.delete);

module.exports = router;
