const mongoose = require('mongoose');
const { Schema } = mongoose;

const discountCategorySchema = new Schema({
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    discount: {
        type: Schema.Types.ObjectId,
        ref: 'Discount'
    }
    },
    {
        timestamps: true
    }
)

const DiscountCategory = mongoose.model('DiscountCategory', discountCategorySchema);

module.exports = DiscountCategory;