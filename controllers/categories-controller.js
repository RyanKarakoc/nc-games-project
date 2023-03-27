const { fetchCategories } = require("../models/categories-model");

const getCategories = (request, response, next) => {
  fetchCategories().then((categories) => {
    response.status(200).send(categories.rows)
  }).catch((error) => {
    next(error)
  })
};

module.exports = { getCategories };
