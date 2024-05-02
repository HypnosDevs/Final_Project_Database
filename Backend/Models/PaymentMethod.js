const mongoose = require("mongoose");
const { Schema } = mongoose;

const paymentMethodSchema = new Schema(
    {

        order_id: [{
            type: Schema.Types.ObjectId,
            ref: 'Order'
        }],
        account_number: {
            type: String,
            required: true
        },
        expiry_date: {
            type: String,
            required: true
        }

    },
    {
        timestamps: true
    }
);

const PaymentMethod = mongoose.model('PaymentMethod', paymentMethodSchema);

// // Middleware to prevent clients from setting the role field
// userSchema.pre('save', function (next) {
//     // If the document is new (i.e., being created), or the role field is being modified
//     if (this.isNew || this.isModified('role')) {
//         // Set the role to the default value
//         this.role = "USER";
//     }
//     next();
// });

module.exports = PaymentMethod;

