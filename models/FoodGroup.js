const mongoose = require("mongoose");

const FoodGroup = mongoose.model("FoodGroup", {
  name: String,
  srcImg: String,
});

module.exports = FoodGroup;
