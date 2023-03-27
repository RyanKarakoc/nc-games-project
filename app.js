const express = require('express');
const {getCategories} = require('./controllers/categories-controller');

const app = express();

app.get('/api/categories', getCategories);

app.use('*', (request, response) => {
    response.status(404).send({msg: 'Incorrect Path!'})
})

module.exports = app;