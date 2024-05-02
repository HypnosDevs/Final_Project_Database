const mongoose = require("mongoose");

const { Schema } = mongoose;

const productSchema = new Schema({
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
        type: Schema.Types.ObjectId,
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