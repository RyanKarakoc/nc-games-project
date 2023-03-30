const {
  fetchCommentsFromReviews,
  fetchPostReviewComment,
} = require("../models/comments-model");

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

const postReviewComment = (request, response, next) => {
  const msg = request.body.body;
  const username = request.body.username;
  const review_id = request.params.review_id;

  fetchPostReviewComment(msg, username, review_id)
    .then((result) => {
      response.status(201).send({ msg: result });
    })
    .catch(next);
};

module.exports = { getCommentsFromReviews, postReviewComment };
