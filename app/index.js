require("./db/connection");
const cors = require("cors");
const express = require("express");
const groups = require("./routes/groups");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/groups", groups);

module.exports = app;
