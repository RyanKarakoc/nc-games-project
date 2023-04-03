const { fetchApi } = require("../models/api-model");

const getApi = (request, response, next) => {
  fetchApi().then((result) => {
    response.status(200).json(require("../endpoints.json"));
  });
};

module.exports = { getApi };
