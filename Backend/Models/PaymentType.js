const mongoose = require("mongoose");
const { Schema } = mongoose;

const paymentTypeSchema = new Schema(
    {

        name: {
            type: String,
            required: true

        },
        paymentmethod: [{
            type: Schema.Types.ObjectId,
            ref: 'PaymentMethod'
        }],


    },
    {
        timestamps: true
    }
);

const PaymentType = mongoose.model('PaymentType', paymentTypeSchema);

// // Middleware to prevent clients from setting the role field
// userSchema.pre('save', function (next) {
//     // If the document is new (i.e., being created), or the role field is being modified
//     if (this.isNew || this.isModified('role')) {
//         // Set the role to the default value
//         this.role = "USER";
//     }
//     next();
// });

module.exports = PaymentType;

