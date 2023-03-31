const errorHandlePSQL400 = (error, request, response, next) => {
  if (error.code === "23503") {
    response.status(400).send({ msg: "No such username" });
  }
  if (error.code === "42P02") {
    response.status(400).send({ msg: "Missing property" });
  }
  if (error.code === "22P02") {
    response.status(400).send({ msg: "Invalid ID" });
  } else {
    next(error);
  }
};

const invalidIdError = (error, request, response, next) => {
  if (error.code === "22003") {
    response.status(400).send({ msg: "Invalid parametric end point" });
  } else {
    next(error);
  }
};

const customErrors = (error, request, response, next) => {
  if (error.status && error.msg) {
    response.status(error.status).send({ msg: error.msg });
  } else {
    next(error);
  }
};

const errorHandle404 = (request, response, next) => {
  response.status(404).send({ msg: "Incorrect Path!" });
};

const errorHandle500s = (error, request, response, next) => {
  response.send(500).send({ msg: "Oops server error!" });
};

module.exports = {
  errorHandle404,
  errorHandlePSQL400,
  invalidIdError,
  customErrors,
  errorHandle500s,
};
