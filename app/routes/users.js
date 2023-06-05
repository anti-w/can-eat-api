const router = require("express").Router();
const controller = require("../controllers/users");

router.post("/register", controller.registerUser);
router.post("/login", controller.loginUser);
router.delete("/", controller.deleteUser);
router.put("/", controller.updateUser);

module.exports = router;
