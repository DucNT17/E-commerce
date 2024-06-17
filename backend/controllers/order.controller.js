const Order = require('../models/order.model')
const User = require('../models/user.model')
const Coupon = require('../models/coupon.model')
const asyncHandler = require('express-async-handler');

const createOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { products, total, address, status } = req.body;

    if (address) {
        await User.findByIdAndUpdate(_id, { address, cart: [] });
    }

    // const data = { products, total, orderBy: _id, coupon: coupon || null };
    const data = { products, total, orderBy: _id };
    if(status) {
        data.status = status;
    }
    // if (coupon) {
    //     const selectedCoupon = await Coupon.findById(coupon);
    //     if (selectedCoupon.quantity <= 0) {
    //         return res.status(200).json({
    //             success: false,
    //             mes: "Coupon invalid",
    //         });
    //     }
    //     data.coupon = coupon;
    //     await Coupon.findByIdAndUpdate(coupon, {
    //         $inc: { quantity: -1, usageCount: 1 },
    //     });
    // }

    // if (status) data.status = status;
    const response = await Order.create(data);

    return res.json({
        success: response ? true : false,
        mes: response ? response : "Some thing went wrong",
    })
});

const updateOrderStatus = asyncHandler(async (req, res) => {
    const { oid } = req.params;
    const { status } = req.body;
    if (!status) throw new Error("Missing status");
    const response = await Order.findByIdAndUpdate(oid, { status }, { new: true });
    return res.json({
        success: response ? true : false,
        rs: response ? response : "Some thing went wrong",
    })
});

const getUserOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const response = await Order.find({ orderBy: _id });
    return res.json({
        success: response ? true : false,
        rs: response ? response : "Some thing went wrong",
    })
});
const getOrders = asyncHandler(async (req, res) => {
    const response = await Order.find();
    return res.json({
        success: response ? true : false,
        rs: response ? response : "Some thing went wrong",
    })
});

module.exports = {
    createOrder,
    updateOrderStatus,
    getUserOrder,
    getOrders
}