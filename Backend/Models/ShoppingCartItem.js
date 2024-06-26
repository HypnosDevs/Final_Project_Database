const mongoose = require('mongoose');
const { Schema } = mongoose;

const shoppingCartItemSchema = new Schema({
    qty: {
        type: Number,
        required: true
    },
    // shoppingcart: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'ShoppingCart',
    //     required: true
    // },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }


},
    {
        timestamps: true
    }
)

const ShoppingCartItem = mongoose.model('ShoppingCartItem', shoppingCartItemSchema);

module.exports = ShoppingCartItem;