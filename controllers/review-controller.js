const {
  fetchReviewById,
  fetchReviews,
  fetchPatchReviewsVotes,
} = require("../models/review-model");

const getReviewById = (request, response, next) => {
  const review_id = request.params.review_id;
  fetchReviewById(review_id)
    .then((reviews) => {
      response.status(200).send({ reviews: reviews });
    })
    .catch(next);
};

const getReviews = (request, response, next) => {
  const { category, sort_by, order } = request.query;
  fetchReviews(category, sort_by, order)
    .then((result) => {
      response.status(200).send({ reviews: result });
    })
    .catch(next);
};

const patchReviewsVotes = (request, response, next) => {
  const requestObject = request.body;
  const review_id = request.params.review_id;
  const votes = request.body.inc_votes;

  fetchPatchReviewsVotes(review_id, requestObject, votes)
    .then((result) => {
      response.status(200).send({ review: result });
    })
    .catch(next);
};

module.exports = { getReviewById, getReviews, patchReviewsVotes };
