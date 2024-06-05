const express = require('express');
const routes = express.Router()
const product = require('../controllers/product.controller')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')
const uploader = require('../configs/cloudinary.config');

routes.post('/', [verifyAccessToken, isAdmin],
    uploader.fields([
        { name: 'images', maxCount: 10 },
        { name: 'thumb', maxCount: 1 }
    ]), product.createProduct);
    
routes.get('/', product.getProducts);

routes.put('/ratings', [verifyAccessToken], product.ratings);

routes.post('/image/:pid', [verifyAccessToken, isAdmin], uploader.fields([
    { name: 'image', maxCount: 10 },
    { name: 'thumb', maxCount: 1 }
]), product.uploadImageProduct);
routes.put('/:pid', [verifyAccessToken, isAdmin], product.updateProduct);
routes.delete('/:pid', [verifyAccessToken, isAdmin], product.deleteProduct);
routes.get('/:pid', product.getProduct);


module.exports = routes;