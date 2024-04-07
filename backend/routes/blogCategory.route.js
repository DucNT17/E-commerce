const express = require('express');
const routes = express.Router();
const blogCategory = require('../controllers/blogCategory.controller')
const { isAdmin, verifyAccessToken } = require('../middlewares/verifyToken')


routes.post('/', [verifyAccessToken, isAdmin], blogCategory.createCategory);
routes.get('/', blogCategory.getCategories);
routes.put('/:pcid', [verifyAccessToken, isAdmin], blogCategory.updateCategory);
routes.delete('/:pcid', [verifyAccessToken, isAdmin], blogCategory.deleteCategory);
routes.get('/:pcid', blogCategory.getCategory);


module.exports = routes;