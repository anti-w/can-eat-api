const router = require("express").Router();
const controller = require("../controllers/groups");

router.get("/", controller.getGroups);

module.exports = router;
