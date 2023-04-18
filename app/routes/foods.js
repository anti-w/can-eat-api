const router = require("express").Router();
const controller = require("../controllers/foods");

router.get("/all", controller.getFoods);

module.exports = router;
