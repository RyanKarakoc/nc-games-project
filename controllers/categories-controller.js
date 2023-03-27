const { fetchCategories } = require("../models/categories-model");

const getCategories = (request, response, next) => {
  fetchCategories()
    .then((categories) => {
      response.status(200).send({ categories: categories });
    })
    .catch(next);
};

module.exports = { getCategories };
