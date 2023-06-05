const jwt = require("jsonwebtoken");

const router = require("express").Router();
const controller = require("../controllers/users");
const middlewareJWT = require("../middleware/checkToken");

router.post("/register", controller.registerUser);
router.post("/login", controller.loginUser);
router.delete("/", controller.deleteUser);
router.put("/", controller.updateUser);
router.get(
  "/user/:id",
  (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ msg: "Acesso negado!" });

    try {
      const secret = process.env.SECRET;

      jwt.verify(token, secret);

      next();
    } catch (err) {
      res.status(400).json({ msg: "O Token é inválido!" });
    }
  },
  controller.authenticateUser
);

module.exports = router;
