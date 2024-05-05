const mongoose = require('mongoose');

const { Schema } = mongoose;

const shoppingCartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

    },
    {
        timestamps: true
    }
)

const ShoppingCart = mongoose.model('ShoppingCart', shoppingCartSchema);

module.exports = ShoppingCart;