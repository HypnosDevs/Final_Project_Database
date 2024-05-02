const ShoppingCart = require("../Models/ShoppingCart");
const ShoppingCartItem = require("../Models/ShoppingCartItem");
const User = require("../Models/User");




exports.getAllShoppingcartFromuser = async (req, res) => {
    try {
        if (!req.session.userId) {
            throw { message: "Authentication fail" };
        }
        const user = await User.findById(req.session.userId);

        if (user.length === 0) {
            throw { message: "User not found" };
        }

        const shoppingcart = await user.populate("shoppingcart")

        res.status(200).send(shoppingcart);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.getShoppingCart = async (req, res) => {
    try {
        const { shoppingcart_id } = req.params;
        const data = await ShoppingCart.findById({ _id: shoppingcart_id });
        if (data.length === 0) {
            throw { message: "Shopping cart Not Found" };
        }
        res.status(200).send(data);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}



exports.addShoppingCart = async (req, res) => {
    try {
        if (!req.session.userId) {
            throw { message: "Authentication fail" };
        }
        const user = await User.findById({ _id: req.session.userId });
        if (user.length === 0) {
            throw { message: "User Not Found" };
        }
        const shoppingCart = new ShoppingCart();
        shoppingCart.user = user;
        shoppingCart.save();
        res.status(201).send(shoppingCart);

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.deleteShoppingCart = async (req, res) => {
    try {
        const { shoppingcart_id } = req.params;
        await ShoppingCartItem.deleteMany({ shoppingcart: shoppingcart_id });
        await ShoppingCart.deleteOne({ _id: shoppingcart_id });
        res.status(204).send({ message: "Delete order item succesful" });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}