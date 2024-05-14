const mongoose = require('mongoose');
const { Schema } = mongoose;

const discountSchema = new mongoose.Schema({
    discount: {
        type: Number,
        required: true,
    },
    min_price: {
        type: Number,
        required: true,
    },
    max_discount: {
        type: Number,
        required: true,
    },
    discountcategory: [{
        type: Schema.Types.ObjectId,
        ref: "DiscountCategory"
    }]
},
    {
        timestamps: true
    }
)

const Discount = mongoose.model('Discount', discountSchema);

module.exports = Discount;