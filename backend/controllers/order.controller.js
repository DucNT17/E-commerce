const Order = require('../models/order.model')
const User = require('../models/user.model')
const Coupon = require('../models/coupon.model')
const asyncHandler = require('express-async-handler');

const createOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { coupon } = req.body;
    const userCart = await User.findById(_id).select("cart").populate("cart.product", "title price");
    const products = userCart?.cart?.map(el => ({
        product: el.product._id,
        count: el.quantity,
        color: el.color
    }))
    let total = userCart?.cart?.reduce((sum, el) => sum + el.product.price * el.quantity, 0);
    const validCoupon = await Coupon.findOne({ name: coupon });
    if (coupon) {
        total = Math.round(total * (1 - validCoupon.discount / 100) / 1000) * 1000;
    }
    const response = await Order.create({ products, total, orderBy: _id, coupon: validCoupon })
    return res.json({
        success: response ? true : false,
        order: response ? response : "Some thing went wrong",
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