// const ShoppingCart = require("../Models/ShoppingCart.js");
const ShoppingCartItem = require("../Models/ShoppingCartItem.js");
const Product = require("../Models/Product.js");
const User = require("../Models/User.js");



exports.getAllShoppingCartItem = async (req, res) => {
    try {
        const data = await ShoppingCartItem.find();
        res.status(200).send(data);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}


exports.getItemFromShoppingCart = async (req, res) => {
    try {
        const { user_id } = req.params;
        // console.log("getitemshoppingcart", req.params)
        // get shopping cart from specific user
        const data = await ShoppingCartItem.find({ user: user_id }).populate('product');
        // console.log("uesr", data);

        // if (data.length === 0) {
        //     throw { message: "Data (product in that shopping cart id) Not Found" };
        // }

        res.status(200).send(data);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.addShoppingCartItem = async (req, res) => {
    try {
        const { user_id, product_id } = req.params;

        const user = await User.findById(user_id);
        // console.log("params", req.params);
        // console.log("product", product_id);
        // console.log("shoppingcart", shoppingcart_id);
        //shoppingcart = shoppingcart.data;
        // console.log(shoppingcart);
        if (!user) {
            throw { message: "Shopping Cart Not Found" };
        }
        const product = await Product.findById({ _id: product_id });
        if (!product) {
            throw { message: "Product Not Found" };
        }
        const shoppingCartItem = new ShoppingCartItem(req.body);
        shoppingCartItem.user = user;
        shoppingCartItem.product = product;
        user.shoppingcart.push(shoppingCartItem);
        user.save();
        shoppingCartItem.save();
        res.status(201).send({ message: "Create shopping cart item succesful" });

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.deleteShoppingCartItem = async (req, res) => {
    try {
        const { shoppingcart_item_id } = req.params;

        // Delete the shopping cart item
        const shopItem = await ShoppingCartItem.deleteOne({ _id: shoppingcart_item_id });
        console.log('delete shopItem', shopItem)
        // Remove the reference from the shopping cart model
        const shoppingCart = await User.findOneAndUpdate(
            { shoppingcart: shoppingcart_item_id },
            { $pull: { shoppingcart: shoppingcart_item_id } },
            { new: true }
        );

        if (!shoppingCart) {
            throw { message: "Shopping cart not found or item not in the cart" };
        }

        console.log('kuy2');
        res.status(204).send({ message: "Delete shopping cart item successful" });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.deleteAllShoppingCartItem = async (req, res) => {
    try {
        // Delete all shopping cart items
        await ShoppingCartItem.deleteMany({});

        // Update all user documents to remove references to shopping cart items
        const updatedUsers = await User.updateMany(
            {},
            { $set: { shoppingcart: [] } } // Clear the shopping cart array
        );

        // Check if any user was updated
        if (updatedUsers.nModified === 0) {
            throw new Error("No users found to update");
        }

        res.status(204).send({ message: "Delete all shopping cart items and update users successful" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: err.message });
    }
}


exports.deleteShoppingCartItemByProduct = async (req, res) => {
    try {
        console.log('gluay')
        const { product_id } = req.params;
        items = await ShoppingCartItem.find({ product: product_id });
        // for (let i = 0; i < items.length; i++) {
        //     items[i] = items[i]._id;
        // }
        // console.log("items", items);

        // Delete the shopping cart item
        const test = await ShoppingCartItem.deleteMany({ product: product_id });
        // console.log("test", test);

        // // Remove the reference from the shopping cart model
        // for (let i = 0; i < items.length; i++) {
        //     await ShoppingCart.updateOne(
        //         { shoppingCartItems: items[i] },
        //         { $pull: { shoppingCartItems: items[i] } },
        //         { new: true }
        //     );
        // }

        res.status(204).send({ message: "Delete shopping cart item by product successful" });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}