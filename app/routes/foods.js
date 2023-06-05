const router = require("express").Router();
const controller = require("../controllers/foods");

router.get("/", controller.getFoods);

module.exports = router;
