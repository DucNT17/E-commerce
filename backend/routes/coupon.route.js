const express = require('express');
const routes = express.Router()
const coupon = require('../controllers/coupon.controller')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

routes.post('/', [verifyAccessToken, isAdmin], coupon.createCoupon);
routes.get('/', coupon.getCoupons);
routes.get('/:cid', coupon.getCoupon);
routes.put('/:cid', [verifyAccessToken, isAdmin], coupon.updateCoupon);
routes.delete('/:cid', [verifyAccessToken, isAdmin], coupon.deleteCoupon);

module.exports = routes;