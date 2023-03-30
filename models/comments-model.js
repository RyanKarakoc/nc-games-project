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

const fetchPostReviewComment = (msg, username, review_id) => {
  if (msg === "") {
    return Promise.reject({ status: 400, msg: "No body comment" });
  }

  let queryParameters = [];
  let insertCommentQueryString = `
  INSERT INTO comments 
    (body, author, review_id)
  VALUES 
    ($1, $2, $3)
  RETURNING *;
  `;
  if (msg && username && review_id) {
    queryParameters.push(msg);
    queryParameters.push(username);
    queryParameters.push(review_id);
  }

  return db.query(insertCommentQueryString, queryParameters).then((result) => {
    const comment = result.rows[0].body;
    return comment;
  });
};

module.exports = { fetchCommentsFromReviews, fetchPostReviewComment };
