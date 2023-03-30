const db = require("../db/connection");

const fetchUsers = () => {
  return db.query(`SELECT * FROM users;`).then((result) => {
    const users = result.rows;
    return users;
  });
};

module.exports = { fetchUsers };
