const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true
        },
        address: [{
            type: Schema.Types.ObjectId,
            ref: 'Address'
        }],
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            default: "USER",
            enum: ["USER", "ADMIN", "PRODUCT MANAGER"],
            required: true
        },
        firstname: {
            type: String,
            required: true
        },

        lastname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Others"]
        },
        order: [{
            type: Schema.Types.ObjectId,
            ref: 'Order'
        }],
        paymentmethod: [{
            type: Schema.Types.ObjectId,
            ref: 'PaymentMethod'
        }],
        shoppingcart: [{
            type: Schema.Types.ObjectId,
            ref: 'ShoppingCartItem'
        }]

    },
    {
        timestamps: true
    }
);

const User = mongoose.model('User', userSchema);

// // Middleware to prevent clients from setting the role field
// userSchema.pre('save', function (next) {
//     // If the document is new (i.e., being created), or the role field is being modified
//     if (this.isNew || this.isModified('role')) {
//         // Set the role to the default value
//         this.role = "USER";
//     }
//     next();
// });

module.exports = User;

