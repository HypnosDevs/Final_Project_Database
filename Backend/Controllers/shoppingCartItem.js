const ShoppingCart = require("../Models/ShoppingCart.js");
const ShoppingCartItem = require("../Models/ShoppingCartItem.js");
const Product = require("../Models/Product.js");



exports.getAllShoppingCartItem = async (req, res) => {
    try {
        const data = await ShoppingCartItem.find();
        res.status(200).send(data);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.getShoppingCartItem = async (req, res) => {
    try {
        const { shoppingcart_id, product_id } = req.params;
        const data = await ShoppingCartItem.findById({ shoppingcart: shoppingcart_id, product: product_id });
        if (data.length === 0) {
            throw { message: "Shopping Cart item Not Found" };
        }
        res.status(200).send(data);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.getItemFromShoppingCart = async (req, res) => {
    try {
        const { shoppingcart_id } = req.params;
        const data = await ShoppingCartItem.find({ shoppingcart: shoppingcart_id }).populate("product");
        if (data.length === 0) {
            throw { message: "Data (product in that shopping cart id) Not Found" };
        }
        res.status(200).send(data);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.addShoppingCartItem = async (req, res) => {
    try {
        const { shoppingcart_id, product_id } = req.params;

        console.log("params",req.params);
        console.log("product",product_id);
        console.log("shoppingcart",shoppingcart_id);
        const shoppingcart = await ShoppingCart.findById({ _id: shoppingcart_id });
        if (shoppingcart.length === 0) {
            throw { message: "Order Not Found" };
        }
        const product = await Product.findById({ _id: product_id });
        if (product.length === 0) {
            throw { message: "Product Not Found" };
        }
        const shoppingCartItem = new ShoppingCartItem(req.body);
        shoppingCartItem.shoppingcart = shoppingcart;
        shoppingCartItem.product = product;
        shoppingCartItem.save();
        res.status(201).send({ message: "Create shopping cart item succesful" });

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.deleteShoppingCartItem = async (req, res) => {
    try {
        // console.log(req.params)
        const { shoppingcart_item_id } = req.params;
        await ShoppingCartItem.deleteOne({ _id: shoppingcart_item_id})
        console.log('kuy2')
        res.status(204).send({ message: "Delete shopping cart item successful" });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}