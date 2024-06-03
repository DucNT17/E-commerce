const express = require('express');
const routes = express.Router()
const insert = require('../controllers/insertData')

routes.post('/product', insert.insertProduct);
routes.post('/category', insert.insertCategory);
routes.post('/role', insert.insertRole);

module.exports = routes;