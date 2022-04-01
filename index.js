require("./connectDB");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

//Config JSON response
app.use(express.json());

app.listen(port, () => {
  console.log(`App rodando! Acesse: http://localhost:${port}`);
});

//Models

const User = require("./models/User");

//Public Route
app.get("/", async (req, res) => {
  res.status(200).json({
    msg: "Bem vindo a API",
  });
});

//Private Route
app.get("/user/:id", checkToken, async (req, res) => {
  const id = req.params.id;

  // check if user exists
  const user = await User.findById(id, "-password");

  if (!user) {
    return res.status(404).json({ msg: "Usuário não encontrado!" });
  }

  res.status(200).json({ user });
});

function checkToken(req, res, next) {
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
}

//Register User
app.post("/auth/register", async (req, res) => {
  const { name, email, password, confirmpassword } = req.body;

  //validation
  if (!name) {
    return res.status(422).json({ msg: "O nome é obrigatório mané" });
  }
  if (!email) {
    return res.status(422).json({ msg: "O e-mail é obrigatório mané" });
  }
  if (!password) {
    return res.status(422).json({ msg: "O password é obrigatório mané" });
  }
  if (password !== confirmpassword) {
    return res.status(422).json({ msg: "As senhas não são iguais" });
  }

  //check if user exists
  const userExists = await User.findOne({ email: email });

  if (userExists) {
    return res.status(422).json({
      msg: "E-mail já cadastrado",
    });
  }

  //create password
  const salt = await bcrypt.genSalt(12);

  const passwordHash = await bcrypt.hash(password, salt);

  //create user
  const user = new User({
    name,
    email,
    password: passwordHash,
  });

  try {
    await user.save();

    res.status(201).json({
      msg: "Usuário criado com sucesso",
    });
  } catch (err) {
    console.log(err);

    res
      .status(500)
      .json({ msg: "Aconteceu um erro no servidor, tente novamente" });
  }
});

//Login User
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(422).json({ msg: "O e-mail é obrigatório mané" });
  }
  if (!password) {
    return res.status(422).json({ msg: "O password é obrigatório mané" });
  }
  //check if user exists
  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(404).json({ msg: "usuário não encontrado" });
  }

  //check if password match
  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    return res.status(422).json({ msg: "Senha inválida" });
  }

  try {
    const secret = process.env.SECRET;

    const token = jwt.sign(
      {
        id: user._id,
      },
      secret
    );

    res.status(200).json({
      msg: "Autenticação realizada com sucesso",
      token,
    });
  } catch (err) {
    console.log(err);

    res
      .status(500)
      .json({ msg: "Aconteceu um erro no servidor, tente novamente" });
  }
});
