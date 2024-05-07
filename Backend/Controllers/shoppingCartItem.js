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
        console.log(req.params)
        const data = await ShoppingCartItem.find({ shoppingcart: shoppingcart_id }).populate('product');
        console.log(data)

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
        const { shoppingcart_id, product_id } = req.params;

        console.log("params", req.params);
        console.log("product", product_id);
        console.log("shoppingcart", shoppingcart_id);
        let shoppingcart = await ShoppingCart.findById({ _id: shoppingcart_id, inUsed: true });
        //shoppingcart = shoppingcart.data;
        console.log(shoppingcart);
        if (!shoppingcart) {
            throw { message: "Shopping Cart Not Found" };
        }
        const product = await Product.findById({ _id: product_id });
        if (!product) {
            throw { message: "Product Not Found" };
        }
        const shoppingCartItem = new ShoppingCartItem(req.body);
        shoppingCartItem.shoppingcart = shoppingcart;
        shoppingCartItem.product = product;
        shoppingcart.shoppingCartItems.push(shoppingCartItem);
        shoppingcart.save();
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
        const shoppingCart = await ShoppingCart.findOneAndUpdate(
            { shoppingCartItems: shoppingcart_item_id },
            { $pull: { shoppingCartItems: shoppingcart_item_id } },
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

exports.deleteShoppingCartItemByProduct = async (req, res) => {
    try {
        console.log('gluay')
        const { product_id } = req.params;
        items = await ShoppingCartItem.find({ product: product_id });
        for (let i = 0; i < items.length; i++) {
            items[i] = items[i]._id; 
        }
        console.log("items", items);
        
        // Delete the shopping cart item
        const test = await ShoppingCartItem.deleteMany({ product: product_id });
        console.log("test", test);

        // Remove the reference from the shopping cart model
        for (let i = 0; i < items.length; i++) {
            await ShoppingCart.updateOne(
                { shoppingCartItems: items[i] },
                { $pull: { shoppingCartItems: items[i] } },
                { new: true }
            );
        }

        res.status(204).send({ message: "Delete shopping cart item by product successful" });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}