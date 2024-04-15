const ProductCategory = require('../models/productCategory.model');
const asyncHandler = require('express-async-handler');

const createCategory = asyncHandler(async (req, res) => {
    const response = await ProductCategory.create(req.body);
    return res.json({
        success: response ? true : false,
        createdCategory: response ? response : "Cannot create product category"
    })
})

const getCategories = asyncHandler(async (req, res) => {
    const response = await ProductCategory.find().select('title _id');
    return res.json({
        success: response ? true : false,
        productCategories: response ? response : "Cannot find product categories"
    });
})

const getCategory = asyncHandler(async (req, res) => {
    const { pcid } = req.params;
    const response = await ProductCategory.findById(pcid).select('title', '_id');
    return res.json({ 
        success: response ? true : false, 
        ProductCategory: response ? response : "Cannot find product category" 
    });
});

const updateCategory = asyncHandler(async (req, res) => {
    const { pcid } = req.params;
    const response = await ProductCategory.findByIdAndUpdate(pcid, req.body, { new: true });
    return res.json({
        success: response ? true : false,
        updatedCategory: response ? response : "Cannot updated product category"
    });
})


const deleteCategory = asyncHandler(async (req, res) => {
    const { pcid } = req.params;
    const response = await ProductCategory.findByIdAndDelete(pcid);
    return res.json({
        success: response ? true : false,
        deletedCategory: response ? response : "Cannot delete product category"
    });
})


module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
}