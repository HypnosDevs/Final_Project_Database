const mongoose = require('mongoose');

const { Schema } = mongoose;

const orderSchema = new Schema({
    order_item: [{
        type: Schema.Types.ObjectId,
        ref: 'OrderItem'
    }]
})

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;