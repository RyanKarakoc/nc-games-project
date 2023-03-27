const db = require("../db/connection");

const fetchCategories = () => {
  let categoryQueryString = `SELECT * FROM categories;`;

  return db.query(categoryQueryString);
};

module.exports = { fetchCategories };
