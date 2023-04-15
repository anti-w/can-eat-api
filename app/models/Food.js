const mongoose = require("mongoose");

const Food = mongoose.model("foods", {
  nome: String,
  codigo: String,
  grupoAlimentar: String,
  nutrientes: Object,
});

module.exports = Food;
