const Food = require("../models/Food");

const getFoods = async (req, res) => {
  let { page = 0, group, term, limit = 15 } = req.query;

  page = page * 10;

  if (!term && !group) {
    const foods = await Food.find().skip(page).limit(limit).sort("nome");

    return res.status(200).send(foods);
  }

  if (term) {
    const foods = await Food.find({
      nome: { $regex: term, $options: "i" },
    })
      .skip(page)
      .limit(limit)
      .sort("nome");

    return res.status(200).send(foods);
  }

  if (group) {
    const foods = await Food.find({
      grupoAlimentar: { $eq: group },
    })
      .skip(page)
      .limit(limit)
      .sort("nome");
    return res.status(200).send(foods);
  }

  const foods = await Food.find({
    $and: [
      { nome: { $regex: term, $options: "i" } },
      { grupoAlimentar: { $eq: group } },
    ],
  })
    .skip(page)
    .limit(limit)
    .sort("nome");
  return res.status(200).send(foods);
};

module.exports = { getFoods };
