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
    stock: {
        type: Number,
        default: 0,
        min: 0,
        required: true
    }
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;