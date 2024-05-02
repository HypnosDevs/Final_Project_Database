const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    status: {
        type: String
    },
    qty: {
        type: Number,
        required: true
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    }

})

const OrderItem = mongoose.model('OrderItem', orderItemSchema);

module.exports = OrderItem;