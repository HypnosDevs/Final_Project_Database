const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        default: 0,
        min: 0,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    stock: {
        type: Number,
        default: 0,
        min: 0,
        required: true
    },
    image: {
        type: String
    }
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;