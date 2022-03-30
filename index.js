const connect = require("./connectDB");
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
});

//Public Route

app.get("/", async (req, res) => {
  const result = await mongoClient.find({}).toArray();
  res.send(result);
});
