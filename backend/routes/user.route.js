const express = require('express');
const routes = express.Router()
const user = require('../controllers/user.controller')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

routes.post('/register', user.register)
routes.put('/finalregister/:token', user.finalRegister)
routes.post('/login', user.login)
routes.post('/refreshtoken', user.refreshAccessToken)

routes.get('/current', verifyAccessToken, user.getCurrent)
routes.get('/', [verifyAccessToken, isAdmin], user.getUsers)
routes.post('/forgotpassword', user.forgotPassword)
routes.get('/logout', user.logout)

routes.delete('/', [verifyAccessToken, isAdmin], user.deleteUser)

routes.put('/resetpassword', user.resetPassword)
routes.put('/cart', [verifyAccessToken], user.updateCart)
routes.put('/current', [verifyAccessToken], user.updateUser)
routes.put('/address', [verifyAccessToken], user.updateUserAddress)
routes.put('/:uid', [verifyAccessToken, isAdmin], user.updateUserByAdmin)

module.exports = routes
