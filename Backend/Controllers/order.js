const Order = require("../Models/Order.js");
const OrderItem = require("../Models/OrderItem.js");
const PaymentMethod = require("../Models/PaymentMethod.js");
const User = require("../Models/User.js");




exports.getAllOrders = async (req, res) => {
    try {
        const data = await Order.find();
        res.status(200).send(data);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.getOrder = async (req, res) => {
    try {
        const { order_id } = req.params;
        const data = await Order.findById({ _id: order_id });
        if (data.length === 0) {
            throw { message: "Order item Not Found" };
        }
        res.status(200).send(data);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}



exports.addOrder = async (req, res) => {
    try {
        const { payment_id, user_id } = req.params;
        const paymentmethod = await PaymentMethod.findById(payment_id);
        if (paymentmethod.length === 0) {
            throw { message: "Paymentmethod Not Found" };
        }
        const user = await User.findById(user_id);
        if (user.length === 0) {
            throw { message: "User Not Found" };
        }
        const order = new Order(req.body);
        order.paymentmethod = paymentmethod;
        order.user = user;
        order.save();
        res.status(201).send(order);

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.deleteOrder = async (req, res) => {
    try {
        const { order_id } = req.params;
        await OrderItem.deleteMany({ order: order_id });
        await Order.deleteOne({ _id: order_id });
        res.status(204).send({ message: "Delete order item succesful" });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}