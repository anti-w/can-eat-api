require("./connectDB");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
//Config JSON response
app.use(express.json());

app.listen(port, () => {
  console.log(`App rodando! Acesse: http://localhost:${port}`);
});

//Models

const User = require("./models/User");
const Food = require("./models/Food");
const FoodGroup = require("./models/FoodGroup");

//Public Route
app.get("/", async (req, res) => {
  res.status(200).json({
    msg: "Bem vindo a API",
    test: 1,
  });
});

app.get("/groups", async (req, res) => {
  const groups = await FoodGroup.find();
  return res.status(200).send(groups);
});

app.get("/foods/:group/:page", async (req, res) => {
  let page = req.params.page * 10;

  const group = req.params.group;

  if (group === "Todos os alimentos") {
    const foods = await Food.find().skip(page).limit(10).sort("nome");
    return res.status(200).send(foods);
  }

  const foods = await Food.find({
    grupoAlimentar: { $eq: group },
  })
    .skip(page)
    .limit(10)
    .sort("nome");
  return res.status(200).send(foods);
});

app.get("/foods/search/:group?/:searchParams/:page", async (req, res) => {
  let page = req.params.page * 10;
  const searchParams = req.params.searchParams;
  const group = req.params.group;
  console.log(group);

  if (!group) {
    const foods = await Food.find({
      nome: { $regex: searchParams, $options: "i" },
    })
      .skip(page)
      .limit(10)
      .sort("nome");

    return res.status(200).send(foods);
  }

  const foods = await Food.find({
    $and: [
      { nome: { $regex: searchParams, $options: "i" } },
      { grupoAlimentar: { $eq: group } },
    ],
  })
    .skip(page)
    .limit(10)
    .sort("nome");
  return res.status(200).send(foods);
});

app.get("/foods/:page", async (req, res) => {
  let page = req.params.page * 10;

  const foods = await Food.find().skip(page).limit(10).sort("nome");
  return res.status(200).send(foods);
});

//Private Route
app.get("/user/:id", checkToken, async (req, res) => {
  const id = req.params.id;

  // check if user exists
  const user = await User.findById(id, "-password");

  if (!user) {
    return res.status(404).json({ msg: "Usuário não encontrado!" });
  }

  return res.status(200).json({ user });
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
    return res.status(422).send({
      msg: "Email já cadastrado",
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
      user,
    });
  } catch (err) {
    console.log(err);

    res
      .status(500)
      .json({ msg: "Aconteceu um erro no servidor, tente novamente" });
  }
});
