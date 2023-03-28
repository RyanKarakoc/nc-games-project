const db = require("../db/connection");

const fetchCommentsFromReviews = (review_id) => {
  const queryParameters = [];
  let selectCommentQueryString = `SELECT comments.* FROM comments`;
  if (review_id) {
    selectCommentQueryString += ` JOIN reviews ON comments.review_id = reviews.review_id
    WHERE reviews.review_id = $1
    ORDER BY created_at DESC;`;
    queryParameters.push(review_id);
  }
  return db.query(selectCommentQueryString, queryParameters).then((result) => {
    const comment = result.rows;
    return comment;
  });
};

module.exports = { fetchCommentsFromReviews };
