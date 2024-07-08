const express = require('express');
const routes = express.Router();
const banner = require('../controllers/banner.controller')
const { isAdmin, verifyAccessToken } = require('../middlewares/verifyToken')
const uploader = require('../configs/cloudinary.config');

routes.post('/', [verifyAccessToken, isAdmin], uploader.single('thumb'), banner.createBanner);
routes.get('/', banner.getBanners);
routes.put('/:bid', [verifyAccessToken, isAdmin], uploader.single('thumb'), banner.updateBanner);
routes.delete('/:bid', [verifyAccessToken, isAdmin], banner.deleteBanner);

module.exports = routes;