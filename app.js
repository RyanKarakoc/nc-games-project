const express = require("express");
const { getCategories } = require("./controllers/categories-controller");
const {
  errorHandlePSQL400,
  invalidIdError,
  errorHandle404,
  errorHandle500s,
} = require("./controllers/error-controllers");
const {
  getReviewById,
  getReviews,
} = require("./controllers/review-controller");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/reviews", getReviews);

app.use(errorHandlePSQL400);
app.use(invalidIdError);
app.all("*", errorHandle404);
app.use(errorHandle500s);

module.exports = app;
