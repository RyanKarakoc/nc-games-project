const db = require("../db/connection");

const fetchReviewById = (review_id) => {
  let selectReviewIdQueryString = `SELECT * FROM reviews`;
  let queryParameters = [];
  if (review_id) {
    selectReviewIdQueryString += ` WHERE review_id = $1;`;
    queryParameters.push(review_id);
  }
  return db.query(selectReviewIdQueryString, queryParameters).then((result) => {
    console.log(result);
    if (result.rowCount === 0) {
      return Promise.reject({
        status: 404,
        msg: "No such parametric endpoint",
      });
    }
    const review = result.rows;
    return review;
  });
};

const fetchReviews = () => {
  let selectReviewQueryString = `
  SELECT reviews.*, CAST(COUNT(comments.review_id) AS INT) AS comment_count
  FROM reviews 
  LEFT JOIN comments ON reviews.review_id = comments.review_id 
  GROUP BY reviews.review_id 
  ORDER BY created_at DESC;
  `;
  return db.query(selectReviewQueryString).then((result) => {
    const reviews = result.rows;
    return reviews;
  });
};

const checkReviewIdExists = (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "No such review ID" });
      }
      const review = result.rows[0];
      return review;
    });
};

module.exports = { fetchReviewById, fetchReviews, checkReviewIdExists };
