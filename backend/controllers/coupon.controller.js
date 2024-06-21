const Coupon = require('../models/coupon.model');
const asyncHandler = require('express-async-handler');

const createCoupon = asyncHandler(async (req, res) => {
    const { name, discount, startDate, endDate, quantity } = req.body;
    if (!name || !discount || !startDate || !endDate || !quantity)
        throw new Error("Missing input");
    if (discount > 100) {
        return res.status(400).json({
            success: false,
            mes: "Cannot reduce 100%",
        });
    }
    const existingCoupons = await Coupon.findOne({ name });
    if (existingCoupons) {
        return res.status(400).json({
            success: false,
            mes: "This promotion already exists",
        });
    }
    const response = await Coupon.create(req.body);
    return res.json({
        success: response ? true : false,
        mes: response ? "Create coupon successful" : "Cannot create coupon",
    });
});

const getCoupons = asyncHandler(async (req, res) => {
    const queries = { ...req.query };
    const excludeFields = ["limit", "page"];
    excludeFields.forEach((el) => delete queries[el]);

    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(
        /\b(gte|gt|lt|lte|size)\b/g,
        (matchedEl) => `$${matchedEl}`
    );
    const formatQueries = JSON.parse(queryString);

    let queryObject = {}
    if (queries?.q) {
        delete formatQueries.q;
        queryObject = {
            $or: [
                { name: { $regex: queries.q, $options: 'i' } },
            ]
        }
    }

    const qr = { ...formatQueries, ...queryObject }
    // Pagination
    const page = +req.query.page || 1;
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
    const skip = (page - 1) * limit;

    const queryCommand = Coupon.find(qr).skip(skip).limit(limit);
    queryCommand.then(async (response) => {
        const counts = await Coupon.find(qr).countDocuments();
        return res.status(200).json({
            success: true,
            counts,
            coupons: response,
        });
    }).catch((err) => {
        throw new Error(err.message);
    });
})

const updateCoupon = asyncHandler(async (req, res) => {
    const { cid } = req.params;
    if (Object.keys(req.body).length === 0) throw new Error("Missing Input");
    if (req.body.discount && req.body.discount > 100) {
        return res.status(400).json({
            success: false,
            mes: "Cannot reduce 100%",
        });
    }
    let status = 0;
    const { startDate, endDate } = req.body;
    const currentDate = new Date();
    if (endDate && new Date(endDate) < currentDate) {
        status = 2;
    } else if (startDate && new Date(startDate) <= currentDate) {
        status = 1;
    }
    const updateData = { ...req.body, status };
    const response = await Coupon.findByIdAndUpdate(cid, updateData, {
        new: true,
    });
    return res.json({
        success: response ? true : false,
        mes: response ? "Updated successful" : "Something went wrong",
    });
});

const deleteCoupon = asyncHandler(async (req, res) => {
    const { cid } = req.params;
    const response = await Coupon.findByIdAndDelete(cid);
    return res.json({
        success: response ? true : false,
        coupons: response ? "Deleted coupon" : "Something went wrong",
    });
});

module.exports = {
    createCoupon,
    getCoupons,
    updateCoupon,
    deleteCoupon
}