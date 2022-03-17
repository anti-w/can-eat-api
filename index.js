const connect = require("./connectDB");
const cors = require("cors");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
connect.connect();
const mongoClient = connect.db("can-eat-db").collection("foods");
app.use(cors());

app.listen(port, () => {
  console.log(`App rodando! Acesse: http://localhost:${port}`);
});

app.get("/", async (req, res) => {
  const result = await mongoClient.find({}).toArray();
  res.send(result);
});
