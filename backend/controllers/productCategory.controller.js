const ProductCategory = require('../models/productCategory.model');
const asyncHandler = require('express-async-handler');

const createCategory = asyncHandler(async (req, res) => {
    const { title } = req.body;
    const data = { title }
    if (!title) throw new Error("missing input");
    const checkTitle = await ProductCategory.findOne({
        title: { $regex: new RegExp("^" + title + "$", "i") },
    });
    if (checkTitle) throw new Error("Category already exists");
    if (req.file) {
        data.image = req.file.path;
    }
    const response = await ProductCategory.create(data);
    return res.json({
        success: response ? true : false,
        mes: response ? "Create category successful" : "Cannot create category"
    })
})

const getCategories = asyncHandler(async (req, res) => {
    const response = await ProductCategory.find();
    return res.json({
        success: response ? true : false,
        productCategories: response ? response : "Cannot find product categories"
    });
})

const getCategory = asyncHandler(async (req, res) => {
    const queries = { ...req.query };
    const excludeFields = ["limit", "page"];
    excludeFields.forEach((el) => delete queries[el]);

    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(
        /\b(gte|gt|lt|lte|size)\b/g,
        (matchedEl) => `$${matchedEl}`
    );
    const formatQueries = JSON.parse(queryString);

    // Pagination
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const skip = (page - 1) * limit;
    // Query categories
    const queryCommand = ProductCategory.find(formatQueries).skip(skip).limit(limit);
    queryCommand
        .then(async (response) => {
            const counts = await ProductCategory.find(formatQueries).countDocuments();
            return res.status(200).json({
                success: true,
                counts,
                category: response,
            });
        })
        .catch((err) => {
            throw new Error(err.message);
        });
});

const updateCategory = asyncHandler(async (req, res) => {
    const { pcid } = req.params;
    const { title } = req.body;
    const data = { title }
    if (req.file) {
        data.image = req.file.path;
    }
    const response = await ProductCategory.findByIdAndUpdate(pcid, data, { new: true });
    return res.json({
        success: response ? true : false,
        mes: response ? "Updated category" : "Cannot updated product category"
    });
})


const deleteCategory = asyncHandler(async (req, res) => {
    const { pcid } = req.params;
    const response = await ProductCategory.findByIdAndDelete(pcid);
    return res.json({
        success: response ? true : false,
        mes: response ? "Delete category successful" : "Cannot delete product category"
    });
})


module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
}