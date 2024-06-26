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
    category: [{
        type: Schema.Types.ObjectId,
        ref: "Category"
    }],
    stock: {
        type: Number,
        default: 0,
        min: 0,
        required: true
    },
    image: {
        type: String
    },
    orderItem: [{
        type: Schema.Types.ObjectId,
        ref: 'OrderItem'
    }]


},
    {
        timestamps: true
    }
)

const Product = mongoose.model('Product', productSchema);

module.exports = Product;