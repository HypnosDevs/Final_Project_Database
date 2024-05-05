const mongoose = require('mongoose');

const { Schema } = mongoose;

const orderSchema = new Schema({
    paymentmethod: {
        type: Schema.Types.ObjectId,
        ref: 'PaymentMethod'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

    },
    {
        timestamps: true
    }
)

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;