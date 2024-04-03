const express = require('express');
const routes = express.Router()
const ctrls = require('../controllers/user.controller')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

routes.post('/register', ctrls.register)
routes.post('/login', ctrls.login)
routes.get('/current', verifyAccessToken, ctrls.getCurrent)
routes.post('/refreshtoken', ctrls.refreshAccessToken)
routes.get('/logout', ctrls.logout)
routes.get('/forgotpassword', ctrls.forgotPassword)
routes.put('/resetpassword', ctrls.resetPassword)
routes.get('/', [verifyAccessToken, isAdmin], ctrls.getUsers)
routes.delete('/', [verifyAccessToken, isAdmin], ctrls.deleteUser)
routes.put('/current', [verifyAccessToken], ctrls.updateUser)
routes.put('/:uid', [verifyAccessToken, isAdmin], ctrls.updateUserByAdmin)

module.exports = routes


// CRUD | Create - Read - Update - Delete | POST - GET - PUT - DELETE
// CREATE (POST) + PUT - body
// GET + DELETE - query // 