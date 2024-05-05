const mongoose = require("mongoose");
const { Schema } = mongoose;

const addressSchema = new Schema(
    {
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
);

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;

