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
    const queries = { ...req.query };
    const { _id } = req.user;
    // Tách các trường đặc biệt ra khỏi query
    const excludeFields = ["limit", "sort", "page", "fields"];
    excludeFields.forEach((el) => delete queries[el]);

    // Format lại các operators cho đúng cú pháp mongoose
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(
        /\b(gte|gt|lt|lte)\b/g,
        (macthedEl) => `$${macthedEl}`
    );
    const formatedQueries = JSON.parse(queryString);
    const qr = { ...formatedQueries, orderBy: _id };
    // let queryCommand = Order.find(qr).populate('orderBy').populate('coupons');
    let queryCommand = Order.find(qr).populate('orderBy')
    // Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        queryCommand = queryCommand.sort(sortBy);
    } else queryCommand = queryCommand.sort("-createdAt");

    // Fields limiting
    if (req.query.fields) {
        const fields = req.query.fields.split(",").join(" ");
        queryCommand = queryCommand.select(fields);
    } else queryCommand = queryCommand.select("-__v");

    // Pagination
    const page = +req.query.page || 1;
    const limit = +req.query.limit || process.env.LIMIT_PRODUCT;
    const skip = (page - 1) * limit;
    queryCommand.skip(skip).limit(limit);
    queryCommand
        .then(async (response) => {
            const counts = await Order.find(qr).countDocuments();
            return res.status(200).json({
                success: response ? true : false,
                counts,
                orderList: response ? response : "Lỗi hệ thống",
            });
        })
        .catch((err) => {
            throw new Error(err.message);
        });
});

const getOrders = asyncHandler(async (req, res) => {
    const queries = { ...req.query };
    // Tách các trường đặc biệt ra khỏi query
    const excludeFields = ["limit", "sort", "page", "fields"];
    excludeFields.forEach((el) => delete queries[el]);
    // Format lại các operators cho đúng cú pháp mongoose
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(
        /\b(gte|gt|lt|lte)\b/g,
        (macthedEl) => `$${macthedEl}`
    );
    const formatedQueries = JSON.parse(queryString);
    const qr = { ...formatedQueries };
    let queryCommand = Order.find(qr).populate("orderBy").populate('coupons');

    // Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        queryCommand = queryCommand.sort(sortBy);
    } else queryCommand = queryCommand.sort("-createdAt");

    // Fields limiting
    if (req.query.fields) {
        const fields = req.query.fields.split(",").join(" ");
        queryCommand = queryCommand.select(fields);
    } else queryCommand = queryCommand.select("-__v");
    // Pagination
    const page = +req.query.page || 1;
    const limit = +req.query.limit || process.env.LIMIT_PRODUCT;
    const skip = (page - 1) * limit;
    queryCommand.skip(skip).limit(limit);
    // Execute query
    // Số lượng sp thỏa mãn điều kiện !== số lượng sp trả về 1 lần gọi API
    queryCommand
        .then(async (response) => {
            const counts = await Order.find(qr).countDocuments();
            return res.status(200).json({
                success: response ? true : false,
                counts,
                orderList: response ? response : "Lỗi hệ thống",
            });
        })
        .catch((err) => {
            throw new Error(err.message);
        });
});

module.exports = {
    createOrder,
    updateOrderStatus,
    getUserOrder,
    getOrders
}