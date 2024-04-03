const express = require('express');
const routes = express.Router()
const ctrls = require('../controllers/product.controller')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')


routes.post('/', [verifyAccessToken, isAdmin], ctrls.createProduct);
routes.get('/', ctrls.getProducts);
routes.put('/ratings', [verifyAccessToken], ctrls.ratings);


routes.put('/:pid', [verifyAccessToken, isAdmin], ctrls.updateProduct);
routes.delete('/:pid', [verifyAccessToken, isAdmin], ctrls.deleteProduct);
routes.get('/:pid', ctrls.getProduct);


module.exports = routes;