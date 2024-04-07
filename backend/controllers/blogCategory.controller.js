const BlogCategory = require('../models/blogCategory.model');
const asyncHandler = require('express-async-handler');

const createCategory = asyncHandler(async (req, res) => {
    const response = await BlogCategory.create(req.body);
    return res.json({
        success: response ? true : false,
        createCategory: response ? response : "Cannot create blog category"
    })
})

const getCategories = asyncHandler(async (req, res) => {
    const response = await BlogCategory.find().select('title _id');
    return res.json({
        success: response ? true : false,
        blogCategories: response ? response : "Cannot find blog categories"
    });
})

const getCategory = asyncHandler(async (req, res) => {
    const { bcid } = req.params;
    const response = await BlogCategory.findById(bcid).select('title', '_id');
    return res.json({
        success: response ? true : false,
        blogCategory: response ? response : "Cannot find blog category"
    });
});

const updateCategory = asyncHandler(async (req, res) => {
    const { bcid } = req.params;
    const response = await BlogCategory.findByIdAndUpdate(bcid, req.body, { new: true });
    return res.json({
        success: response ? true : false,
        updatedCategory: response ? response : "Cannot updated blog category"
    });
})


const deleteCategory = asyncHandler(async (req, res) => {
    const { bcid } = req.params;
    const response = await BlogCategory.findByIdAndDelete(bcid);
    return res.json({
        success: response ? true : false,
        deletedCategory: response ? response : "Cannot delete blog category"
    });
})


module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
}