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
                quantity: Number,
                color: String,
                price: Number,
                thumbnail: String,
                title: String,
            },
        ],
        // coupon: {
        //     type: mongoose.Types.ObjectId,
        //     ref: "Coupon",
        // },
        status: {
            type: Number,
            default: 1,
            enum: [0, 1, 2, 3, 4], //["cancelled", "processing", "delivering", "success", "confirmed"],
        },
        orderBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        total: Number,
    },
    {
        timestamps: true,
    }
);

//Export the model
module.exports = mongoose.model("Order", orderSchema);