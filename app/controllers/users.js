const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const registerUser = async (req, res) => {
  const { name, email, password, confirmpassword } = req.body;

  //validation
  if (!name) {
    return res.status(422).json({ msg: "O nome é obrigatório." });
  }
  if (!email) {
    return res.status(422).json({ msg: "O e-mail é obrigatório." });
  }
  if (!password) {
    return res.status(422).json({ msg: "O password é obrigatório." });
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
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(422).json({ msg: "O e-mail é obrigatório." });
  }
  if (!password) {
    return res.status(422).json({ msg: "O password é obrigatório." });
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
};

const updateUser = async (req, res) => {
  const { email, password, name } = req.body;

  if (!email) {
    return res.status(422).json({ msg: "O e-mail é obrigatório." });
  }
  if (!password) {
    return res.status(422).json({ msg: "O password é obrigatório." });
  }
  if (!name) {
    return res.status(422).json({ msg: "O nome é obrigatório." });
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

  const updatedUser = await User.updateOne({ email: email }, { name: name });

  return res.status(200).json({ msg: "Usuário atualizado", user: updatedUser });
};

const deleteUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(422).json({ msg: "O e-mail é obrigatório." });
  }
  if (!password) {
    return res.status(422).json({ msg: "O password é obrigatório." });
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

  await User.deleteOne({ email: email });

  return res.status(200).json({ msg: "Usuário deletado com sucesso" });
};

const authenticateUser = async (req, res) => {
  const id = req.params.id;

  // check if user exists
  const user = await User.findById(id, "-password");

  if (!user) {
    return res.status(404).json({ msg: "Usuário não encontrado!" });
  }

  return res.status(200).json({ user });
};

module.exports = {
  registerUser,
  loginUser,
  deleteUser,
  updateUser,
  authenticateUser,
};
