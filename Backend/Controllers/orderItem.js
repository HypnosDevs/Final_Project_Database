const OrderItem = require("../Models/Orderitem.js");

exports.getAllOrderItem = async (req, res) => {
    try {
        const data = await OrderItem.find();
        res.send(data);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.getOrderItem = async (req, res) => {
    try {
        const { order_id, product_id } = req.params;
        const data = await OrderItem.findById({ order: order_id, prodcut: product_id });
        res.send(data);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.addOrderItem = async (req, res) => {
    try {
        const { order_id, product_id } = req.params;
        const data = await OrderItem.findById({ order: order_id, product: product_id });
        await data.save();
        res.send(data);

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.deleteOrderItem = async (req, res) => {
    try {
        const { order_id, product_id } = req.params;
        const data = await OrderItem.deleteOne({ order: order_id, prodcut: product_id })
        res.send(data)
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}