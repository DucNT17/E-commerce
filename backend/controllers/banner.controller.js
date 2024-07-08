const Banner = require('../models/banner.model')
const asyncHandler = require('express-async-handler');

const createBanner = asyncHandler(async (req, res) => {
    const { title } = req.body;
    const data = { title };
    if (!title) throw new Error("missing input");
    const checkTitle = await Banner.findOne({
        title: { $regex: new RegExp("^" + title + "$", "i") },
    });
    if (checkTitle) throw new Error("Brand already exists");
    if (req.file) {
        data.thumb = req.file.path;
    }
    const response = await Banner.create(data);
    return res.json({
        success: response ? true : false,
        mes: response ? "Created Banner" : "Cannot create banner",
    });
})

const getBanners = asyncHandler(async (req, res) => {
    const queries = { ...req.query };
    const excludeFields = ["limit", "page", 'sort'];
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
    const queryCommand = Banner.find(formatQueries).skip(skip).limit(limit);
    queryCommand.then(async (response) => {
        const counts = await Banner.find(formatQueries).countDocuments();
        return res.status(200).json({
            success: true,
            counts,
            banners: response,
        });
    }).catch((err) => {
        throw new Error(err.message);
    });
})

const updateBanner = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    const { title } = req.body;
    const data = { title }
    if (req.file) {
        data.thumb = req.file.path;
    }
    const response = await Banner.findByIdAndUpdate(bid, data, { new: true });
    return res.json({
        success: response ? true : false,
        mes: response ? "Updated banner" : "Cannot updated banner"
    });
});


const deleteBanner = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    const response = await Banner.findByIdAndDelete(bid);
    return res.json({
        success: response ? true : false,
        mes: response ? "Banner Deleted" : "Cannot delete banner"
    });
})


module.exports = {
    createBanner,
    getBanners,
    updateBanner,
    deleteBanner
}