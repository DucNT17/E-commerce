const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        lowercase: true
    },
    description: {
        type: Array,
        required: true,
    },
    brand: {
        type: String,
        required: true,
        ref: 'Brand'
    },
    thumb: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        ref: 'Category'
    },
    quantity: {
        type: Number,
        default: 0
    },
    sold: {
        type: Number,
        default: 0
    },
    images: {
        type: Array
    },
    color: {
        type: String,
        // required: true
    },
    ratings: [
        {
            star: { type: Number },
            postedBy: { type: mongoose.Types.ObjectId, ref: 'User' },
            comment: { type: String },
            updatedAt: {
                type: Date,
            }
        }
    ],
    totalRatings: {
        type: Number,
        default: 0
    },
    varriants: [
        {
            color: { type: String },
            price: { type: Number },
            thumb: { type: String },
            images: { type: Array },
            title: { type: String },
            sku: { type: String },
        },
    ],
}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Product', productSchema);