const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderItemSchema = new Schema({
    status: {
        type: String
    },
    qty: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    product_image: {
        type: String
    },
    product_name: {
        type: String
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

},
    {
        timestamps: true
    }
)

const OrderItem = mongoose.model('OrderItem', orderItemSchema);

module.exports = OrderItem;