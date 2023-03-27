const db = require("../db/connection");

const fetchCategories = () => {
  let categoryQueryString = `SELECT * FROM categories;`;

  return db.query(categoryQueryString).then((response) => {
    const categories = response.rows;
    return categories;
  });
};

module.exports = { fetchCategories };
