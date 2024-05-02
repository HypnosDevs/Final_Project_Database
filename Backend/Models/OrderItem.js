const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    status: {
        type: String
    },
    qty: {
        type: Number
    },
    product_id: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]
})

const OrderItem = mongoose.model('OrderItem', orderItemSchema);

module.exports = OrderItem;