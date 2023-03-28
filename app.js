const express = require("express");
const {
  errorHandlePSQL400,
  invalidIdError,
  errorHandle404,
  customErrors,
  errorHandle500s,
} = require("./controllers/error-controllers");

const { getCategories } = require("./controllers/categories-controller");

const {
  getReviewById,
  getReviews,
} = require("./controllers/review-controller");

const { getCommentsFromReviews } = require("./controllers/comments-controller");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/reviews/:review_id/comments", getCommentsFromReviews);

app.use(errorHandlePSQL400);
app.use(invalidIdError);
app.use(customErrors);
app.all("*", errorHandle404);
app.use(errorHandle500s);

module.exports = app;
