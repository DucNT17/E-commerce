const express = require('express');
const routes = express.Router();
const productCategory = require('../controllers/productCategory.controller')
const { isAdmin, verifyAccessToken } = require('../middlewares/verifyToken')


routes.post('/', [verifyAccessToken, isAdmin], productCategory.createCategory);
routes.get('/',  productCategory.getCategories);
routes.put('/:pcid', [verifyAccessToken, isAdmin], productCategory.updateCategory);
routes.delete('/:pcid', [verifyAccessToken, isAdmin], productCategory.deleteCategory);
routes.get('/:pcid', productCategory.getCategory);


module.exports = routes;