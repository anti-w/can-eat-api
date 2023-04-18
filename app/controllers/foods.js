const Food = require("../models/Food");

const getFoods = async (req, res) => {
  let page = req.query.page;
  let groupTittle = req.query.groupTitle;
  let term = req.query.term;

  console.log(req.query);
  page = page * 10;

  if (!term && !groupTittle) {
    const foods = await Food.find().skip(page).limit(10).sort("nome");

    return res.status(200).send(foods);
  } else if (!groupTittle) {
    const foods = await Food.find({
      nome: { $regex: term, $options: "i" },
    })
      .skip(page)
      .limit(10)
      .sort("nome");

    return res.status(200).send(foods);
  } else if (!term) {
    const foods = Food.find({
      grupoAlimentar: { $eq: groupTittle },
    })
      .skip(page)
      .limit(10)
      .sort("nome");
    return res.status(200).send(foods);
  } else {
    const foods = await Food.find({
      $and: [
        { nome: { $regex: term, $options: "i" } },
        { grupoAlimentar: { $eq: groupTittle } },
      ],
    })
      .skip(page)
      .limit(10)
      .sort("nome");
    return res.status(200).send(foods);
  }
};

module.exports = { getFoods };
