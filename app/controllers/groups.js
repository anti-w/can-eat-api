const FoodGroup = require("../models/FoodGroup");

const getGroups = async (req, res) => {
  try {
    const groups = await FoodGroup.find();
    return res.status(200).send(groups);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = { getGroups };
