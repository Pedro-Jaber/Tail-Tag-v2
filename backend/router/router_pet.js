const { Router } = require("express");
const petController = require("../controller/controller_pet");

const router = Router();

// User
router
  .route("/")
  .get(petController.getAllPets)
  .post(petController.createOrUpdate);

router.route("/assign").post(petController.assignPetToUser);
router.route("/restore/:id").put(petController.restore);
router.route("/user/:id").get(petController.getAllPets);

router
  .route("/:id")
  .get(petController.getById)
  .put(petController.createOrUpdate)
  .delete(petController.delete);

module.exports = router;
