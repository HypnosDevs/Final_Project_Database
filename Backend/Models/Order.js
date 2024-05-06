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
    },
    name: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    province: {
        type: String,
        required: true
    },
    amphoe: {
        type: String
    },
    district: {
        type: String
    },
    address_line1: {
        type: String,
        required: true
    },
    address_line2: {
        type: String
    },
    postal_code: {
        type: String,
        required: true
    },
    tel_no: {
        type: String,
        required: true
    }
    },
    {
        timestamps: true
    }
)

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;