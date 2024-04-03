const { response } = require('express');
const Product = require('../models/product.model');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');


const createProduct = asyncHandler(async (req, res) => {
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs');
    if (req.body && req.body.title) {
        req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    return res.status(200).json({
        success: newProduct ? true : false,
        createdProduct: newProduct ? newProduct : 'Cannot create new product'
    });
})

const getProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    const product = await Product.findById(pid);
    return res.status(200).json({
        success: product ? true : false,
        productData: product ? product : 'Cannot get product'
    });
})

// Filtering, sorting & pagination
const getProducts = asyncHandler(async (req, res) => {
    const queries = { ...req.query };
    // tách các trường đặc biệt ra khỏi query
    const excludeFields = ["limit", "sort", "page", "fields"];
    excludeFields.forEach(el => delete queries[el]);

    // format các operators đúng theo đúng cú pháp của mongoose
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (matchEl) => `$${matchEl}`);
    const formatedQueries = JSON.parse(queryString);
    // console.log(formatedQueries);
    //Filtering 
    if (queries?.title) formatedQueries.title = { $regex: queries.title, $options: 'i' };
    let queryCommand = Product.find(formatedQueries);

    // Sorting 
    // abc,efg => [abc,efg] => abc efg
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

    // Pagination
    // page=2&limit=10, 1-10 page 1, 11-20 page 2, 21-30 page 3
    // skip: số object lấy về 1 lần gọi API

    const page = +req.query.page || 1;
    const limit = +req.query.limit || 100;
    const skip = (page - 1) * limit;
    queryCommand = queryCommand.skip(skip).limit(limit);


    // Execute query
    // Số lượng sản phẩm thỏa mãn điều kiện != số lượng sản phẩm trả về 1 lần gọi API
    // queryCommand.exec(async (err, response) => {
    //     if (err) throw new Error(err.message);
    //     const counts = await Product.find(formattedQueries).countDocuments();
    //     return res.status(200).json({
    //         success: response ? true : false,
    //         products: response ? response : 'Cannot get products',
    //         counts
    //     });  
    // })
    queryCommand.then(async (response) => {
        const counts = await Product.find(formatedQueries).countDocuments();
        return res.status(200).json({
            success: response ? true : false,
            counts,
            products: response ? response : 'Cannot get products'
        });
    }).catch((err) => {
        throw new Error(err.message);
    })
})

const updateProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    if (req.body && req.body.title) {
        req.body.slug = slugify(req.body.title);
    }
    const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, { new: true });
    return res.status(200).json({
        success: updatedProduct ? true : false,
        updatedProduct: updatedProduct ? updatedProduct : 'Cannot update product'
    });
})

const deleteProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const deletedProduct = await Product.findByIdAndDelete(pid)
    return res.status(200).json({
        success: deletedProduct ? true : false,
        deletedProduct: deletedProduct ? deletedProduct : 'Cannot delete product'
    })
})

const ratings = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, comment, pid } = req.body;
    if (!star || !pid) throw new Error('Missing inputs');
    const ratingProduct = await Product.findById(pid);
    const alreadyRating = ratingProduct?.ratings?.find(el => el.postedBy.toString() === _id);
    // console.log({ alreadyRating });
    if (alreadyRating) {
        // update star and comment
        await Product.updateOne({
            $ratings: { $elementMatch: alreadyRating }
        }, {
            $set: { "ratings.$.star": star, "ratings.$.comment": comment }
        }, { new: true });
    } else {
        // add star and comment
        const response = await Product.findByIdAndUpdate(pid, {
            $push: { ratings: { star, comment, postedBy: _id } }
        }, { new: true });
    }

    // Sum rating

    return res.status(200).json({
        status: true,
    })
})

module.exports = {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    ratings
}