const db = require("../db/connection");

const fetchReviewById = (review_id) => {
  let selectReviewIdQueryString = `SELECT * FROM reviews`;
  let queryParameters = [];
  if (review_id) {
    selectReviewIdQueryString += ` WHERE review_id = $1;`;
    queryParameters.push(review_id);
  }
  return db.query(selectReviewIdQueryString, queryParameters).then((result) => {
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

const fetchReviews = (category, sort_by = "created_at", order = "desc") => {
  const queryParameters = [];
  let selectReviewQueryString = `
  SELECT reviews.*, CAST(COUNT(comments.review_id) AS INT) AS comment_count
  FROM reviews 
  LEFT JOIN comments ON reviews.review_id = comments.review_id 
  `;
  console.log(order);
  if (order !== "asc" && order !== "desc") {
    return Promise.reject({ status: 400, msg: "Invalid order by query" });
  }

  if (category) {
    return db.query(`SELECT * FROM categories;`).then((result) => {
      const allCategories = result.rows;
      const filteredCategories = allCategories.filter((databaseCategories) => {
        return databaseCategories.slug === category;
      });
      if (filteredCategories.length === 0) {
        selectReviewQueryString += `GROUP BY reviews.review_id`;
        return Promise.reject({ status: 404, msg: "Invalid Category" });
      } else {
        selectReviewQueryString += ` 
        WHERE category = '${category}'
        GROUP BY reviews.review_id;
      `;
      }
      return db.query(selectReviewQueryString).then((result) => {
        const reviews = result.rows;
        return reviews;
      });
    });
  }
  if (sort_by) {
    return db
      .query(
        `
      SELECT reviews.*, CAST(COUNT(comments.review_id) AS INT) AS comment_count
      FROM reviews 
      LEFT JOIN comments ON reviews.review_id = comments.review_id 
      GROUP BY reviews.review_id;
      `
      )
      .then((result) => {
        const reviewSample = result.rows[0];
        if (!reviewSample.hasOwnProperty(sort_by)) {
          selectReviewQueryString += `GROUP BY reviews.review_id;`;
          return Promise.reject({ status: 404, msg: "Invalid sort by query" });
        } else {
          selectReviewQueryString += `
        GROUP BY reviews.review_id
        ORDER BY ${sort_by} ${order};
        `;
        }
        return db.query(selectReviewQueryString).then((result) => {
          const reviews = result.rows;
          return reviews;
        });
      });
  }
  console.log(selectReviewQueryString);
  return db.query(selectReviewQueryString, queryParameters).then((result) => {
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

const fetchPatchReviewsVotes = (review_id, requestObject, votes) => {
  let count = 0;
  for (const keys in requestObject) {
    if (requestObject.hasOwnProperty(keys)) {
      count++;
    }
  }

  if (count > 1) {
    return Promise.reject({ status: 400, msg: "To many properties" });
  }
  if (count < 2) {
    if (!requestObject.hasOwnProperty("inc_votes")) {
      return Promise.reject({ status: 400, msg: "Wrong key used" });
    }
    if (typeof requestObject.inc_votes !== "number") {
      return Promise.reject({ status: 400, msg: "Vote is not a number" });
    }
  }

  let queryParameters = [];
  let selectReviewIdQueryString = ``;
  if (review_id && votes) {
    selectReviewIdQueryString += `
    UPDATE reviews 
    SET votes = votes + $2 
    WHERE review_id = $1 
    RETURNING *;
    `;
    queryParameters.push(review_id);
    queryParameters.push(votes);
  }
  return db.query(selectReviewIdQueryString, queryParameters).then((result) => {
    const review = result.rows[0];
    return review;
  });
};

module.exports = {
  fetchReviewById,
  fetchReviews,
  checkReviewIdExists,
  fetchPatchReviewsVotes,
};
