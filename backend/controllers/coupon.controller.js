const Coupon = require('../models/coupon.model');
const asyncHandler = require('express-async-handler');

const createCoupon = asyncHandler(async (req, res) => {
    const { name, discount, expiry } = req.body;
    if (!name || !discount || !expiry) {
        throw new Error("Missing inputs");
    }
    const response = await Coupon.create({ ...req.body, expiry: Date.now() + +expiry * 24 * 60 * 60 * 1000 });
    return res.json({
        success: response ? true : false,
        createdBlog: response ? response : "Cannot create new coupon"
    })
})

const getCoupons = asyncHandler(async (req, res) => {
    const response = await Coupon.find().select("-createdAt -updatedAt");
    return res.json({
        success: response ? true : false,
        coupons: response ? response : "Cannot get coupons"
    });
})

const getCoupon = asyncHandler(async (req, res) => {
    const { cid } = req.params;
    if(Object.keys(cid).length === 0) throw new Error("Missing input");
    const response = await Coupon.findById(cid);
    return res.json({
        success: response ? true : false,
        coupon: response ? response : "Cannot find coupon"
    });
});

const updateCoupon = asyncHandler(async (req, res) => {
    const { cid } = req.params;
    if (Object.keys(cid).length === 0) throw new Error("Missing input");
    if(req.body.expiry) {
        req.body.expiry = Date.now() + +req.body.expiry * 24 * 60 * 60 * 1000;
    }
    const response = await Coupon.findByIdAndUpdate(cid, req.body, { new: true });
    return res.json({ success: response ? true : false, updatedCoupon: response ? response : "Cannot update coupon" });
});

const deleteCoupon = asyncHandler(async (req, res) => {
    const { cid } = req.params;
    if (Object.keys(cid).length === 0) throw new Error("Missing input");
    const response = await Coupon.findByIdAndDelete(cid);
    return res.json({ success: response ? true : false, deletedCoupon: response ? response : "Cannot delete coupon" });
});

module.exports = {
    createCoupon,
    getCoupons,
    getCoupon,
    updateCoupon,
    deleteCoupon
}