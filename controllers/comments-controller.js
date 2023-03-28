const { fetchCommentsFromReviews } = require("../models/comments-model");
const { checkReviewIdExists } = require("../models/review-model");

const getCommentsFromReviews = (request, response, next) => {
  const review_id = request.params.review_id;
  const commentPromises = [fetchCommentsFromReviews(review_id)];
  if (review_id) {
    commentPromises.push(checkReviewIdExists(review_id));
  }
  Promise.all(commentPromises)
    .then(([result]) => {
      response.status(200).send({ comments: result });
    })
    .catch(next);
};

module.exports = { getCommentsFromReviews };
