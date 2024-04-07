const express = require('express');
const routes = express.Router()
const user = require('../controllers/user.controller')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

routes.post('/register', user.register)
routes.post('/login', user.login)
routes.get('/current', verifyAccessToken, user.getCurrent)
routes.post('/refreshtoken', user.refreshAccessToken)
routes.get('/logout', user.logout)
routes.get('/forgotpassword', user.forgotPassword)
routes.put('/resetpassword', user.resetPassword)
routes.get('/', [verifyAccessToken, isAdmin], user.getUsers)
routes.delete('/', [verifyAccessToken, isAdmin], user.deleteUser)
routes.put('/current', [verifyAccessToken], user.updateUser)
routes.put('/:uid', [verifyAccessToken, isAdmin], user.updateUserByAdmin)

module.exports = routes


// CRUD | Create - Read - Update - Delete | POST - GET - PUT - DELETE
// CREATE (POST) + PUT - body
// GET + DELETE - query // 