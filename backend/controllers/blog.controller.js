const Blog = require('../models/blog.model');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');

const createBlog = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    
    const thumb = req?.files?.thumb[0]?.path;

    if (!(title && description)) {
        throw new Error("Missing inputs");
    }

    req.body.slug = slugify(title);
    if (thumb) req.body.thumb = thumb;
    const response = await Blog.create(req.body);
    return res.json({
        success: response ? true : false,
        mes: response ? "Blog create successful" : "Cannot create new blog"
    })
})

const getBlogs = asyncHandler(async (req, res) => {
    const queries = { ...req.query };
    // tách các trường đặc biệt ra khỏi query
    const excludeFields = ["limit", "sort", "page", "fields"];
    excludeFields.forEach(el => delete queries[el]);
    // format các operators đúng theo đúng cú pháp của mongoose
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (matchEl) => `$${matchEl}`);
    const formatedQueries = JSON.parse(queryString);

    if (queries?.title) formatedQueries.title = { $regex: queries.title, $options: 'i' };
    let queryObject = {}
    if(queries?.q) {
        delete formatedQueries.q;
        queryObject = {
            $or: [
                { title: { $regex: queries.q, $options: 'i' } },
            ]
        }
    }
    const qr = { ...formatedQueries, ...queryObject }

    let queryCommand = Blog.find(qr);

    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        queryCommand = queryCommand.sort(sortBy);
    } else {
        queryCommand = queryCommand.sort('-createdAt');
    }

    // Fields limiting
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ')
        queryCommand = queryCommand.select(fields)
    } else {
        queryCommand = queryCommand.select('-__v')
    }

    const page = +req.query.page || 1;
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
    const skip = (page - 1) * limit;
    queryCommand = queryCommand.skip(skip).limit(limit);


    queryCommand.then(async (response) => {
        const counts = await Blog.find(qr).countDocuments();
        return res.status(200).json({
            success: response ? true : false,
            counts,
            blogs: response ? response : 'Cannot get blogs'
        });
    }).catch((err) => {
        throw new Error(err.message);
    })
})

const getBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    const response = await Blog.findByIdAndUpdate(bid, { $inc: { numberViews: 1 } }, { new: true })
        .populate('likes', 'firstname lastname')
        .populate('dislikes', 'firstname lastname');
    return res.json({
        success: response ? true : false,
        blog: response ? response : "Cannot get blog"
    })
})

const updateBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    const files = req?.files;
    if (files?.thumb) req.body.thumb = files?.thumb[0]?.path;
    if (req.body && req.body.title) {
        req.body.slug = slugify(req.body.title);
    }
    const response = await Blog.findByIdAndUpdate(bid, req.body, { new: true });
    return res.json({
        success: response ? true : false,
        mes: response ? "Updated Blog" : "Cannot update blog"
    })
})

const deleteBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    const response = await Blog.findByIdAndDelete(bid);
    return res.json({
        success: response ? true : false,
        mes: response ? "Deleted Blog" : "Cannot delete blog"
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



module.exports = {
    createBlog,
    getBlogs,
    getBlog,
    updateBlog,
    deleteBlog,
    likeBlog,
    dislikeBlog,
}