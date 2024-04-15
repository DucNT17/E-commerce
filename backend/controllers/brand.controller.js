const Brand = require('../models/brand.model');
const asyncHandler = require('express-async-handler');

const createBrand = asyncHandler(async (req, res) => {
    const response = await Brand.create(req.body);
    return res.json({
        success: response ? true : false,
        createdBrand: response ? response : "Cannot create brand"
    })
})

const getBrands = asyncHandler(async (req, res) => {
    const response = await Brand.find();
    return res.json({
        success: response ? true : false,
        brands: response ? response : "Cannot find brands"
    });
})

const getBrand = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    const response = await Brand.findById(bid);
    return res.json({
        success: response ? true : false,
        brand: response ? response : "Cannot find brand"
    });
});

const updateBrand= asyncHandler(async (req, res) => {
    const { bid } = req.params;
    const response = await Brand.findByIdAndUpdate(bid, req.body, { new: true });
    return res.json({
        success: response ? true : false,
        updatedCategory: response ? response : "Cannot updated brand"
    });
})


const deleteBrand = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    const response = await Brand.findByIdAndDelete(bid);
    return res.json({
        success: response ? true : false,
        deletedCategory: response ? response : "Cannot delete brand"
    });
})


module.exports = {
    createBrand,
    getBrands,
    getBrand,
    updateBrand,
    deleteBrand
}