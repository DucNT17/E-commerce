const Brand = require('../models/brand.model');
const asyncHandler = require('express-async-handler');

const createBrand = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const data = { name };
    if (!name) throw new Error("missing input");
    const checkName = await Brand.findOne({
        name: { $regex: new RegExp("^" + name + "$", "i") },
    });
    if (checkName) throw new Error("Brand already exists");
    if (req.file) {
        data.thumb = req.file.path;
    }
    const response = await Brand.create(data);
    return res.json({
        success: response ? true : false,
        mes: response ? "Created Brand" : "Cannot create brand",
    });
})

const getBrands = asyncHandler(async (req, res) => {
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
    const queryCommand = Brand.find(formatQueries).skip(skip).limit(limit);
    queryCommand.then(async (response) => {
        const counts = await Brand.find(formatQueries).countDocuments();
        return res.status(200).json({
            success: true,
            counts,
            brands: response,
        });
    }).catch((err) => {
        throw new Error(err.message);
    });
})

const updateBrand = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    const { name } = req.body;
    const data = { name }
    if (req.file) {
        data.thumb = req.file.path;
    }
    const response = await Brand.findByIdAndUpdate(bid, data, { new: true });
    return res.json({
        success: response ? true : false,
        mes: response ? "Updated brand" : "Cannot updated brand"
    });
});


const deleteBrand = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    const response = await Brand.findByIdAndDelete(bid);
    return res.json({
        success: response ? true : false,
        mes: response ? "Brand Deleted" : "Cannot delete brand"
    });
})


module.exports = {
    createBrand,
    getBrands,
    updateBrand,
    deleteBrand
}