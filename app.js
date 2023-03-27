const express = require("express");
const { getCategories } = require("./controllers/categories-controller");
const { errorHandle404, errorHandle500s } = require("./controllers/error-controllers");

const app = express();

app.get("/api/categories", getCategories);

app.all("*", errorHandle404);
app.use(errorHandle500s);

module.exports = app;
