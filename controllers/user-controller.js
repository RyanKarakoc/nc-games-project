const { fetchUsers } = require("../models/user-model");

const getUsers = (request, response, next) => {
  fetchUsers().then((result) => {
    response.status(200).send({ users: result });
  });
};

module.exports = { getUsers };
