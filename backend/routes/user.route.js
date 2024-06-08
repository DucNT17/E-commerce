const express = require('express');
const routes = express.Router()
const user = require('../controllers/user.controller')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')
const uploader = require('../configs/cloudinary.config');

routes.post('/register', user.register)
routes.put('/finalregister/:token', user.finalRegister)
routes.post('/login', user.login)
routes.post('/refreshtoken', user.refreshAccessToken)
routes.post('/mock', user.createUsers)


routes.get('/current', verifyAccessToken, user.getCurrent)
routes.get('/', [verifyAccessToken, isAdmin], user.getUsers)
routes.post('/forgotpassword', user.forgotPassword)
routes.get('/logout', user.logout)

routes.delete('/:uid', [verifyAccessToken, isAdmin], user.deleteUser)

routes.put('/resetpassword', user.resetPassword)
routes.put('/cart', [verifyAccessToken], user.updateCart)
routes.delete('/remove-cart/:pid', [verifyAccessToken], user.removeProductInCart)
routes.put('/current', verifyAccessToken,uploader.single('avatar'), user.updateUser)
routes.put('/address', [verifyAccessToken], user.updateUserAddress)
routes.put('/:uid', [verifyAccessToken, isAdmin], user.updateUserByAdmin)

module.exports = routes
