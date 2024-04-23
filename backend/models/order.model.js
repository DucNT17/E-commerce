const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema(
    {
        products: [
            {
                product: {
                    type: mongoose.Types.ObjectId,
                    ref: "Product",
                },
                count: Number,
                color: String,
            },
        ],
        total: Number,
        coupon: {
            type: mongoose.Types.ObjectId,
            ref: "Coupon",
        },
        status: {
            type: String,
            default: "Processing",
            enum: [
                // "Not Processed",
                // "Cash on Delivery",
                "Processing",
                "Cancelled",
                "Successed",
            ],
        },
        orderBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

//Export the model
module.exports = mongoose.model("Order", orderSchema);