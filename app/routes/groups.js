const router = require("express").Router();
const controller = require("../controllers/groups");

router.get("/all", controller.getGroups);

module.exports = router;
