const db = require("../db/connection");

const fetchReviewById = (review_id) => {
  let selectReviewIdQueryString = `SELECT * FROM reviews`;
  let queryParameters = [];
  if (review_id) {
    selectReviewIdQueryString += ` WHERE review_id = $1;`;
    queryParameters.push(review_id);
  }
  return db.query(selectReviewIdQueryString, queryParameters).then((result) => {
    const review = result.rows;
    return review;
  });
};

module.exports = { fetchReviewById };
