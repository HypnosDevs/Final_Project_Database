const Order = require("../Models/Order.js");
const OrderItem = require("../Models/OrderItem.js");
const Product = require("../Models/Product.js");



exports.getAllOrderItem = async (req, res) => {
    try {
        const data = await OrderItem.find().sort({ timestamp: -1 }); // Sort by timestamp in descending order
        res.status(200).send(data);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}
exports.getOrderItem = async (req, res) => {
    try {
        const { order_id, product_id } = req.params;
        const data = await OrderItem.findById({ order: order_id, product: product_id });
        if (data.length === 0) {
            throw { message: "Order item Not Found" };
        }
        res.status(200).send(data);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.getOrderItemFromOrder = async (req, res) => {
    try {
        const { order_id } = req.params;
        const data = await OrderItem.findById({ order: order_id });
        if (!data) {
            throw { message: "Order item Not Found" };
        }
        res.status(200).send(data);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.getProductFromOrderItem = async (req, res) => {
    try {
        const { order_id, product_id } = req.params;
        const data = await OrderItem.findById({ order: order_id, product: product_id });
        if (data.length === 0) {
            throw { message: "Data (product in that order id) Not Found" };
        }
        data = data.populate("product")
        res.status(200).send(data);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.addOrderItem = async (req, res) => {
    try {
        const { order_id, product_id } = req.params;
        const order = await Order.findById({ _id: order_id });
        if (order.length === 0) {
            throw { message: "Order Not Found" };
        }
        const product = await Product.findById({ _id: product_id });
        if (product.length === 0) {
            throw { message: "Product Not Found" };
        }
        const orderItem = new OrderItem(req.body);
        orderItem.order = order;
        orderItem.product = product;
        orderItem.save();
        res.status(201).send({ message: "Create order item succesful" });

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.deleteOrderItem = async (req, res) => {
    try {
        const { order_id, product_id } = req.params;
        await OrderItem.deleteOne({ order: order_id, product: product_id })
        res.status(204).send({ message: "Delete order item succesful" });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}