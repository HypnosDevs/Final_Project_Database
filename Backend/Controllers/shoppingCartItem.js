const { pool } = require('../db/db.js');

exports.getAllShoppingCartItem = async (req, res) => {
    try {
        const [data] = await pool.query('SELECT * FROM shopping_cart_item');
        res.status(200).send(data);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.getItemFromShoppingCart = async (req, res) => {
    try {
        const { user_id } = req.params;
        const query = `
            SELECT sci.*, p.*, c.*
            FROM shopping_cart_item sci
            JOIN product p ON sci.product_item_id = p.id
            JOIN category c ON p.category_id = c.category_id
            WHERE sci.user_id = ?
        `;
        const [data] = await pool.query(query, [user_id]);
        res.status(200).send(data);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.addShoppingCartItem = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { user_id, product_id, qty } = req.body;
        await connection.beginTransaction();

        const userQuery = 'SELECT * FROM user WHERE user_id = ?';
        const [users] = await connection.query(userQuery, [user_id]);

        if (users.length === 0) {
            throw { message: "User Not Found" };
        }

        const productQuery = 'SELECT * FROM product WHERE product_id = ?';
        const [products] = await connection.query(productQuery, [product_id]);

        if (products.length === 0) {
            throw { message: "Product Not Found" };
        }

        const insertItemQuery = `
            INSERT INTO shopping_cart_item (user_id, product_item_id, qty)
            VALUES (?, ?, ?)
        `;
        await connection.query(insertItemQuery, [user_id, product_id, qty]);

        await connection.commit();
        res.status(201).send({ message: "Create shopping cart item successful" });
    } catch (err) {
        await connection.rollback();
        console.log(err.message);
        res.status(500).send({ message: err.message });
    } finally {
        connection.release();
    }
}

exports.deleteShoppingCartItem = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { shoppingcart_item_id } = req.params;

        await connection.beginTransaction();

        const deleteItemQuery = 'DELETE FROM shopping_cart_item WHERE shopping_cart_item_id = ?';
        const [result] = await connection.query(deleteItemQuery, [shoppingcart_item_id]);

        if (result.affectedRows === 0) {
            throw { message: "Shopping cart item not found" };
        }

        await connection.commit();
        res.status(204).send({ message: "Delete shopping cart item successful" });
    } catch (err) {
        await connection.rollback();
        console.log(err.message);
        res.status(500).send({ message: err.message });
    } finally {
        connection.release();
    }
}

exports.deleteAllShoppingCartItem = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const deleteAllItemsQuery = 'DELETE FROM shopping_cart_item';
        await connection.query(deleteAllItemsQuery);

        const clearUserCartQuery = 'UPDATE user SET shoppingcart = NULL';
        await connection.query(clearUserCartQuery);

        await connection.commit();
        res.status(204).send({ message: "Delete all shopping cart items and update users successful" });
    } catch (err) {
        await connection.rollback();
        console.error(err.message);
        res.status(500).send({ message: err.message });
    } finally {
        connection.release();
    }
}

exports.deleteShoppingCartItemByProduct = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { product_id } = req.params;

        await connection.beginTransaction();

        const deleteItemsQuery = 'DELETE FROM shopping_cart_item WHERE product_item_id = ?';
        await connection.query(deleteItemsQuery, [product_id]);

        await connection.commit();
        res.status(204).send({ message: "Delete shopping cart item by product successful" });
    } catch (err) {
        await connection.rollback();
        console.log(err.message);
        res.status(500).send({ message: err.message });
    } finally {
        connection.release();
    }
}

















// const ShoppingCart = require("../Models/ShoppingCart.js");
// const ShoppingCartItem = require("../Models/ShoppingCartItem.js");
// const Product = require("../Models/Product.js");
// const User = require("../Models/User.js");



// exports.getAllShoppingCartItem = async (req, res) => {
//     try {
//         const data = await ShoppingCartItem.find();
//         res.status(200).send(data);
//     } catch (err) {
//         console.log(err.message);
//         res.status(500).send({ message: err.message });
//     }
// }


// exports.getItemFromShoppingCart = async (req, res) => {
//     try {
//         const { user_id } = req.params;
//         // console.log("getitemshoppingcart", req.params)
//         // get shopping cart from specific user
//         const data = await ShoppingCartItem.find({ user: user_id })
//             .populate({
//                 path: 'product',
//                 populate: { path: 'category' } // Populate the 'category' field inside the 'product'
//             });        // console.log("uesr", data);

//         // if (data.length === 0) {
//         //     throw { message: "Data (product in that shopping cart id) Not Found" };
//         // }

//         res.status(200).send(data);
//     } catch (err) {
//         console.log(err.message);
//         res.status(500).send({ message: err.message });
//     }
// }

// exports.addShoppingCartItem = async (req, res) => {
//     try {
//         const { user_id, product_id } = req.params;

//         const user = await User.findById(user_id);
//         // console.log("params", req.params);
//         // console.log("product", product_id);
//         // console.log("shoppingcart", shoppingcart_id);
//         //shoppingcart = shoppingcart.data;
//         // console.log(shoppingcart);
//         if (!user) {
//             throw { message: "Shopping Cart Not Found" };
//         }
//         const product = await Product.findById({ _id: product_id });
//         if (!product) {
//             throw { message: "Product Not Found" };
//         }
//         const shoppingCartItem = new ShoppingCartItem(req.body);
//         shoppingCartItem.user = user;
//         shoppingCartItem.product = product;
//         user.shoppingcart.push(shoppingCartItem);
//         user.save();
//         shoppingCartItem.save();
//         res.status(201).send({ message: "Create shopping cart item succesful" });

//     } catch (err) {
//         console.log(err.message);
//         res.status(500).send({ message: err.message });
//     }
// }

// exports.deleteShoppingCartItem = async (req, res) => {
//     try {
//         const { shoppingcart_item_id } = req.params;

//         // Delete the shopping cart item
//         const shopItem = await ShoppingCartItem.deleteOne({ _id: shoppingcart_item_id });
//         console.log('delete shopItem', shopItem)
//         // Remove the reference from the shopping cart model
//         const shoppingCart = await User.findOneAndUpdate(
//             { shoppingcart: shoppingcart_item_id },
//             { $pull: { shoppingcart: shoppingcart_item_id } },
//             { new: true }
//         );

//         if (!shoppingCart) {
//             throw { message: "Shopping cart not found or item not in the cart" };
//         }

//         console.log('kuy2');
//         res.status(204).send({ message: "Delete shopping cart item successful" });
//     } catch (err) {
//         console.log(err.message);
//         res.status(500).send({ message: err.message });
//     }
// }

// exports.deleteAllShoppingCartItem = async (req, res) => {
//     try {
//         // Delete all shopping cart items
//         await ShoppingCartItem.deleteMany({});

//         // Update all user documents to remove references to shopping cart items
//         const updatedUsers = await User.updateMany(
//             {},
//             { $set: { shoppingcart: [] } } // Clear the shopping cart array
//         );

//         // Check if any user was updated
//         if (updatedUsers.nModified === 0) {
//             throw new Error("No users found to update");
//         }

//         res.status(204).send({ message: "Delete all shopping cart items and update users successful" });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send({ message: err.message });
//     }
// }


// exports.deleteShoppingCartItemByProduct = async (req, res) => {
//     try {
//         console.log('gluay')
//         const { product_id } = req.params;
//         items = await ShoppingCartItem.find({ product: product_id });
//         // for (let i = 0; i < items.length; i++) {
//         //     items[i] = items[i]._id;
//         // }
//         // console.log("items", items);

//         // Delete the shopping cart item
//         const test = await ShoppingCartItem.deleteMany({ product: product_id });
//         // console.log("test", test);

//         // // Remove the reference from the shopping cart model
//         // for (let i = 0; i < items.length; i++) {
//         //     await ShoppingCart.updateOne(
//         //         { shoppingCartItems: items[i] },
//         //         { $pull: { shoppingCartItems: items[i] } },
//         //         { new: true }
//         //     );
//         // }

//         res.status(204).send({ message: "Delete shopping cart item by product successful" });
//     } catch (err) {
//         console.log(err.message);
//         res.status(500).send({ message: err.message });
//     }
// }