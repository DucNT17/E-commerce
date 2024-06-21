const Order = require('../models/order.model')
const User = require('../models/user.model')
const Coupon = require('../models/coupon.model')
const Product = require('../models/product.model')
const asyncHandler = require('express-async-handler');

const createOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { products, total, address, status, coupon } = req.body;

    if (address) {
        await User.findByIdAndUpdate(_id, { address, cart: [] });
    }

    const data = { products, total, orderBy: _id, coupon: coupon || null };
    // const data = { products, total, orderBy: _id };
    if (status) {
        data.status = status;
    }
    if (coupon) {
        const selectedCoupon = await Coupon.findById(coupon);
        if (selectedCoupon.quantity <= 0) {
            return res.status(200).json({
                success: false,
                mes: "Coupon invalid",
            });
        }
        data.coupon = coupon;
        await Coupon.findByIdAndUpdate(coupon, {
            $inc: { quantity: -1, usageCount: 1 },
        });
    }

    if (status) {
        data.status = status
    };
    const response = await Order.create(data);

    return res.json({
        success: response ? true : false,
        mes: response ? response : "Some thing went wrong",
    })
});

const updateOrderStatus = asyncHandler(async (req, res) => {
    const { oid } = req.params;
    const { status } = req.body;
    const order = await Order.findById(oid).populate({
        path: "products",
        populate: {
            path: "product",
        },
    });
    if (!status) throw new Error("Missing Input");
    const response = await Order.findByIdAndUpdate(
        oid,
        { status },
        { new: true }
    );
    if (response.status === 3) {
        for (const { product: productId, quantity } of order.products) {
            const prod = await Product.findById(productId);
            if (prod) {
                await Product.findByIdAndUpdate(productId, {
                    $inc: { sold: quantity, quantity: -quantity },
                },
                    { new: true }
                );
            }
        }
    }
    return res.json({
        success: response ? true : false,
        mes: response ? 'Updated successfull' : "Some thing went wrong",
        order: response ? response : "Sự cố hệ thống! Vui lòng thử lại",
    })
});

const cancelOrder = asyncHandler(async (req, res) => {
    const { oid } = req.params;
    const { _id } = req.user;

    const order = await Order.findById(oid);

    if (!order) {
        return res.status(404).json({
            success: false,
            mes: "Order not found",
        });
    }

    if (order.status === 0) {
        return res.status(200).json({
            success: false,
            mes: "Your order has been cancelled",
        });
    }

    if (order.status === 2 || order.status === 3 || order.status === 4) {
        return res.status(200).json({
            success: false,
            mes: "Orders cannot be canceled once the order has been confirmed",
        });
    }

    const createdAtTime = new Date(order.createdAt).getTime();
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - createdAtTime;
    const cancelTimeLimit = 30 * 60 * 1000;

    if (timeDiff > cancelTimeLimit) {
        return res.status(200).json({
            success: false,
            mes: "Orders cannot be canceled after 30 minutes from the time the order was created",
        });
    }

    order.status = 0;
    await order.save();

    return res.status(200).json({
        success: true,
        mes: "Order canceled successfully",
        order: order,
    });
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
    let queryCommand = Order.find(qr).populate('orderBy').populate('coupon');
    // let queryCommand = Order.find(qr).populate('orderBy')
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
                orderList: response ? response : "Something went wrong",
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
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (matchEl) => `$${matchEl}`);
    const formatedQueries = JSON.parse(queryString);

    let queryObject = {}
    if (queries?.q) {
        delete formatedQueries.q;
        queryObject = {
            $or: [
                { firstname: { $regex: queries.q, $options: "i" } },
                { lastname: { $regex: queries.q, $options: 'i' } },
                { status: { $regex: queries.q, $options: 'i' } },
                { total: { $regex: queries.q, $options: 'i' } }
            ]
        }
    }
    const qr = { ...formatedQueries, ...queryObject };
    let queryCommand = Order.find(qr).populate("orderBy").populate('coupon');
    // let queryCommand = Order.find(qr).populate("orderBy")


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
    queryCommand.then(async (response) => {
        const counts = await Order.find(qr).countDocuments();
        return res.status(200).json({
            success: response ? true : false,
            counts,
            orderList: response ? response : "Something went wrong",
        });
    }).catch((err) => {
        throw new Error(err.message);
    });
});

module.exports = {
    createOrder,
    updateOrderStatus,
    getUserOrder,
    getOrders,
    cancelOrder
}