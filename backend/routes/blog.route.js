const express = require('express');
const routes = express.Router()
const blog = require('../controllers/blog.controller')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')
const uploader = require('../configs/cloudinary.config')


routes.post('/', [verifyAccessToken, isAdmin], blog.createBlog);
routes.get('/', blog.getBlogs);
routes.get('/:bid', blog.getBlog);
routes.put('/:bid', [verifyAccessToken, isAdmin], blog.updateBlog);
routes.delete('/:bid', [verifyAccessToken, isAdmin], blog.deleteBlog);
routes.put('/like/:bid', [verifyAccessToken], blog.likeBlog);
routes.put('/dislike/:bid', [verifyAccessToken], blog.dislikeBlog);
routes.post('/image/:bid', [verifyAccessToken, isAdmin],uploader.single('image'), blog.uploadImageBlog);


module.exports = routes;