const Address = require("../Models/Address");
const PaymentMethod = require("../Models/PaymentMethod");
const PaymentType = require("../Models/PaymentType");
const User = require("../Models/User");
const bcrypt = require('bcrypt');

exports.addUser = async (req, res) => {
    try {

        const { username, password } = req.body.user;
        const user = await User.find({ username: username });
        if (user.length > 0) {
            return res.status(400).send({ message: "This usesername has been already used" })
        }

        const hash = await bcrypt.hash(password, 10);
        req.body.user.password = hash;

        const userPaymentType = req.body.payment.type
        req.body.payment.type = undefined;
        const userData = new User(req.body.user);
        req.body.address.user = userData;
        const addressData = new Address(req.body.address);
        ;

        const paymentData = new PaymentMethod(req.body.payment);

        const paymentType = await PaymentType.findOne({ name: userPaymentType })

        userData.address.push(addressData);
        userData.paymentmethod.push(paymentData);
        paymentType.paymentmethod.push(paymentData);

        await userData.save();
        await addressData.save();
        await paymentType.save();


        res.status(201).send({ message: "Address added successfully" });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

