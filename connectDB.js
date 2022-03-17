const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = `mongodb+srv://${process.env.MONGODB_CREDENTIALS}@cluster0.o6yj8.mongodb.net/can-eat-db?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

module.exports = client;
