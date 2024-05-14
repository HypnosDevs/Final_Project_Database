const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
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

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;