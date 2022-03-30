const mongoose = require("mongoose");

require("dotenv").config();

const uri = `mongodb+srv://${process.env.MONGODB_CREDENTIALS}@cluster0.o6yj8.mongodb.net/can-eat-db?retryWrites=true&w=majority`;
const client = mongoose
  .connect(uri)
  .then(() => {
    console.log("Connection established");
  })
  .catch((err) => console.log(err));

module.exports = client;
