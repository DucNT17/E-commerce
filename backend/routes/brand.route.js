const express = require('express');
const routes = express.Router();
const brand = require('../controllers/brand.controller')
const { isAdmin, verifyAccessToken } = require('../middlewares/verifyToken')
const uploader = require('../configs/cloudinary.config');

routes.post('/', [verifyAccessToken, isAdmin], uploader.single('thumb'), brand.createBrand);
routes.get('/', brand.getBrands);
routes.put('/:bid', [verifyAccessToken, isAdmin], uploader.single('thumb'), brand.updateBrand);
routes.delete('/:bid', [verifyAccessToken, isAdmin], brand.deleteBrand);


module.exports = routes;