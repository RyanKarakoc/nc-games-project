const { fetchReviewById, fetchReviews } = require("../models/review-model");

const getReviewById = (request, response, next) => {
  const review_id = request.params.review_id;
  fetchReviewById(review_id)
    .then((reviews) => {
      response.status(200).send({ reviews: reviews });
    })
    .catch(next);
};

const getReviews = (request, response, next) => {
  fetchReviews()
    .then((reviews) => {
      response.status(200).send({ reviews: reviews });
    })
    .catch(next);
};
module.exports = { getReviewById, getReviews };
