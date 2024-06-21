const express = require('express');
const routes = express.Router();
const productCategory = require('../controllers/productCategory.controller')
const { isAdmin, verifyAccessToken } = require('../middlewares/verifyToken')
const uploader = require('../configs/cloudinary.config');

routes.post('/', [verifyAccessToken, isAdmin], uploader.single('image'), productCategory.createCategory);
routes.get('/', productCategory.getCategories);
routes.get('/admin', [verifyAccessToken, isAdmin], productCategory.getCategory);
routes.put('/:pcid', [verifyAccessToken, isAdmin], uploader.single('image'), productCategory.updateCategory);
routes.delete('/:pcid', [verifyAccessToken, isAdmin], productCategory.deleteCategory);


module.exports = routes;