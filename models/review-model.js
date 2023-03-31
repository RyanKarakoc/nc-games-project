const db = require("../db/connection");

const fetchReviewById = (review_id) => {
  let queryParameters = [];
  let selectReviewIdQueryString = ``;
  if (review_id) {
    selectReviewIdQueryString = `
    SELECT title, designer, owner, review_img_url, review_body, category, reviews.created_at, reviews.votes, reviews.review_id, CAST(COUNT(comments.review_id) AS INT) AS comment_count
    FROM reviews 
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    WHERE reviews.review_id = $1
    GROUP BY reviews.review_id
    ORDER BY created_at DESC;`;
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
  const checkForSort_ByColumnsPromise = db
    .query(
      `
    SELECT reviews.*, CAST(COUNT(comments.review_id) AS INT) AS comment_count
    FROM reviews 
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    GROUP BY reviews.review_id;
    `
    )
    .then((result) => {
      const allColumnsArr = [];
      for (const keys in result.rows[0]) {
        allColumnsArr.push(keys);
      }
      return allColumnsArr;
    });

  const checkForCategoriesPromise = db
    .query(
      `
      SELECT * FROM categories;
      `
    )
    .then((result) => {
      const allCategories = result.rows.map((category) => {
        return category.slug;
      });
      return allCategories;
    });

  return Promise.all([checkForSort_ByColumnsPromise, checkForCategoriesPromise])
    .then((result) => {
      let selectReviewQueryString = ``;

      const sort_byQuery = result[0];
      const categoryQuery = result[1];

      const selectQueryStringCreator = {
        start: `SELECT reviews.*, CAST(COUNT(comments.review_id) AS INT) AS comment_count
        FROM reviews 
        LEFT JOIN comments ON reviews.review_id = comments.review_id`,
        categoryString: ` `,
        groupBy: ` GROUP BY reviews.review_id `,
        sort_byString: ` `,
        order: ` `,
      };

      if (categoryQuery.includes(category)) {
        selectQueryStringCreator.categoryString = ` WHERE category = '${category}' `;
      }
      if (sort_byQuery.includes(sort_by)) {
        selectQueryStringCreator.sort_byString = `ORDER BY ${sort_by} `;
      }
      if (order !== "asc" && order !== "desc") {
        return Promise.reject({ status: 400, msg: "Invalid order by query" });
      } else {
        selectQueryStringCreator.order = `${order};`;
      }
      for (const keys in selectQueryStringCreator) {
        selectReviewQueryString += selectQueryStringCreator[keys];
      }
      if (category) {
        if (!categoryQuery.includes(category)) {
          return Promise.reject({ status: 404, msg: "Category not found" });
        }
      }
      if (sort_by) {
        if (!sort_byQuery.includes(sort_by)) {
          return Promise.reject({ status: 404, msg: "Invalid sort by query" });
        }
      }
      return selectReviewQueryString;
    })
    .then((result) => {
      return db.query(result);
    })
    .then((result) => {
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
