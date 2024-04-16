const Blog = require('../models/blog.model');
const asyncHandler = require('express-async-handler');

const createBlog = asyncHandler(async (req, res) => {
    const { title, description, category } = req.body;
    if (!title || !description || !category) {
        throw new Error("Missing inputs");
    }
    const response = await Blog.create(req.body);
    return res.json({
        success: response ? true : false,
        createdBlog: response ? response : "Cannot create new blog"
    })
})

const getBlogs = asyncHandler(async (req, res) => {
    const response = await Blog.find();
    return res.json({
        success: response ? true : false,
        Blogs: response ? response : "Cannot get all blogs"
    })
})

const getBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    const response = await Blog.findByIdAndUpdate(bid, { $inc: { numberViews: 1 } }, { new: true })
        .populate('likes', 'firstname lastname')
        .populate('dislikes', 'firstname lastname');
    return res.json({
        success: response ? true : false,
        Blog: response ? response : "Cannot get blog"
    })
})

const updateBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    if (Object.keys(bid).length === 0) {
        throw new Error("Missing inputs");
    }
    const response = await Blog.findByIdAndUpdate(bid, req.body, { new: true });
    return res.json({
        success: response ? true : false,
        updatedBlog: response ? response : "Cannot update blog"
    })
})

const deleteBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    if (Object.keys(bid).length === 0) {
        throw new Error("Missing inputs");
    }
    const response = await Blog.findByIdAndDelete(bid);
    return res.json({
        success: response ? true : false,
        deletedBlog: response ? response : "Cannot delete blog"
    })
})

/* Khi người dùng lile một bài blog thì:
1. Check xem người dùng trước đó có dislike hay không => bỏ dislike 
2. Check xem người dùng trước đó có like hay không => bỏ like
*/

const likeBlog = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { bid } = req.params;
    if (Object.keys(bid).length === 0) {
        throw new Error("Missing Input");
    }
    const blog = await Blog.findById(bid);
    const alreadyDisliked = blog?.dislikes.find((userId) => userId?.toString() === _id);
    if (alreadyDisliked) {
        const response = await Blog.findByIdAndUpdate(bid, {
            $pull: { dislikes: _id },
        }, {
            new: true,
        });
        return res.json({
            success: response ? true : false,
            rs: response
        })
    }
    const isLiked = blog?.likes.find((userId) => userId?.toString() === _id);
    if (isLiked) {
        const response = await Blog.findByIdAndUpdate(bid, {
            $pull: { likes: _id }
        }, {
            new: true,
        })
        return res.json({
            success: response ? true : false,
            rs: response
        })
    } else {
        const response = await Blog.findByIdAndUpdate(bid, {
            $push: { likes: _id },
        }, {
            new: true,
        })
        return res.json({
            success: response ? true : false,
            rs: response
        })
    }
});

const dislikeBlog = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { bid } = req.params;
    if (Object.keys(bid).length === 0) {
        throw new Error("Missing Input");
    }
    const blog = await Blog.findById(bid);
    const alreadyLiked = blog?.likes.find((userId) => userId?.toString() === _id);
    if (alreadyLiked) {
        const response = await Blog.findByIdAndUpdate(bid, {
            $pull: { likes: _id },
        }, {
            new: true,
        });
        return res.json({
            success: response ? true : false,
            rs: response
        })
    }
    const isDisliked = blog?.dislikes.find((userId) => userId?.toString() === _id);
    if (isDisliked) {
        const response = await Blog.findByIdAndUpdate(bid, {
            $pull: { dislikes: _id }
        }, {
            new: true,
        })
        return res.json({
            success: response ? true : false,
            rs: response
        })
    } else {
        const response = await Blog.findByIdAndUpdate(bid, {
            $push: { dislikes: _id },
        }, {
            new: true,
        })
        return res.json({
            success: response ? true : false,
            rs: response
        })
    }
});

const uploadImageBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    if (!req.file) throw new Error("Missing input");
    const response = await Blog.findByIdAndUpdate(bid, { image: req.file.path }, { new: true })
    return res.status(200).json({
        status: response ? true : false,
        updatedBlog: response ? response : "Cannot upload image blog"
    })
});


module.exports = {
    createBlog,
    getBlogs,
    getBlog,
    updateBlog,
    deleteBlog,
    likeBlog,
    dislikeBlog,
    uploadImageBlog
}