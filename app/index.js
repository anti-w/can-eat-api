require("./db/connection");
const cors = require("cors");
const express = require("express");
const groups = require("./routes/groups");
const foods = require("./routes/foods");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/groups", groups);
app.use("/foods", foods);

module.exports = app;
