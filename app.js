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
  patchReviewsVotes,
} = require("./controllers/review-controller");

const {
  getCommentsFromReviews,
  postReviewComment,
  deleteComment,
} = require("./controllers/comments-controller");

const { getUsers } = require("./controllers/user-controller");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/reviews/:review_id/comments", getCommentsFromReviews);
app.get("/api/users", getUsers);

app.post("/api/reviews/:review_id/comments", postReviewComment);

app.patch("/api/reviews/:review_id", patchReviewsVotes);

app.delete("/api/comments/:comment_id", deleteComment);

app.use(errorHandlePSQL400);
app.use(invalidIdError);
app.use(customErrors);
app.all("*", errorHandle404);
app.use(errorHandle500s);

module.exports = app;
