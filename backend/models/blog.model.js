const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
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
        numberViews: {
            type: Number,
            default: 0,
        },
        likes: [
            {
                type: mongoose.Types.ObjectId,
                ref: "User",
            },
        ],
        dislikes: [
            {
                type: mongoose.Types.ObjectId,
                ref: "User",
            },
        ],
        thumb: {
            type: String,
            required: true
        },
        author: {
            type: String,
            default: "Admin",
        },
    },
    {
        timestamps: true
    }
);

//Export the model
module.exports = mongoose.model("Blog", blogSchema);