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

const checkCommentExists = (comment_id) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1;`, [comment_id])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "Comment ID does not exist",
        });
      }
      const review = result.rows[0];
      return review;
    });
};

const fetchDeleteComment = (comment_id) => {
  let queryParameters = [];
  let commentDeleteQueryString = `
DELETE FROM comments
`;
  if (comment_id) {
    commentDeleteQueryString += ` WHERE comment_id = $1`;
    queryParameters.push(comment_id);
  }
  return db.query(commentDeleteQueryString, queryParameters).then((result) => {
    console.log(result.rows);
    const deletedComment = result.rows;
    return deletedComment;
  });
};

module.exports = {
  fetchCommentsFromReviews,
  fetchPostReviewComment,
  fetchDeleteComment,
  checkCommentExists,
};
