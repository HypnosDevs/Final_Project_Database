const ShoppingCart = require("../Models/ShoppingCart");
const ShoppingCartItem = require("../Models/ShoppingCartItem");
const User = require("../Models/User");


exports.getAllShoppingcart = async (req, res) => {
    try {
        const data = await ShoppingCart.find();
        res.status(200).send(data);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

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
        console.log(req.params)
        
        const data = await ShoppingCart.findById(shoppingcart_id);
        console.log(data)
        if (data && data.length === 0) {
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
        const {id} = req.params;
        if (!id) {
            throw { message: "Authentication fail" };
        }
        const user = await User.findById({ _id: id });
        console.log('addshopping cart to user:',user);
        if (user.length === 0) {
            throw { message: "User Not Found" };
        }
        if (user.shoppingcart.length > 0) {
            res.status(201).send(user.shoppingcart);
        } else {
            const shoppingCart = new ShoppingCart();
            shoppingCart.user = user;
            shoppingCart.save();
            res.status(201).send(shoppingCart);
        }
        
        

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.deleteShoppingCart = async (req, res) => {
    try {
        const { shoppingcart_id } = req.params;
        console.log('kuy')

        await ShoppingCartItem.deleteMany({ shoppingcart: { $in: shoppingcart_id } });
        console.log('kuy')

        await ShoppingCart.deleteOne({ _id: shoppingcart_id });
        console.log('kuy')
        res.status(204).send({ message: "Delete order item succesful" });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}