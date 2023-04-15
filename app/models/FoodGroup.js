const mongoose = require("mongoose");

const FoodGroup = mongoose.model("groups", {
  name: String,
  srcImg: String,
});

module.exports = FoodGroup;
