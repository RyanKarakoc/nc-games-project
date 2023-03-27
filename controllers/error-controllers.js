const errorHandle404 = (request, response, next) => {
  response.status(404).send({ msg: "Incorrect Path!" });
};

const errorHandle500s = (error, request, response, next) => {
  response.send(500).send({ msg: "Oops server error!" });
};

module.exports = { errorHandle404, errorHandle500s };
