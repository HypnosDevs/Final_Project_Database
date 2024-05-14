// const ShoppingCart = require("../Models/ShoppingCart");
// const ShoppingCartItem = require("../Models/ShoppingCartItem");
// const User = require("../Models/User");


// exports.getAllShoppingcart = async (req, res) => {
//     try {
//         const data = await ShoppingCart.find();
//         res.status(200).send(data);
//     } catch (err) {
//         console.log(err.message);
//         res.status(500).send({ message: err.message });
//     }
// }

// exports.getAllShoppingcartFromuser = async (req, res) => {
//     try {
//         const userId = req.params.user_id;
//         if (!userId) {
//             throw { message: "Authentication fail" };
//         }
//         const user = await User.findById(userId);

//         if (user.length === 0) {
//             throw { message: "User not found" };
//         }

//         const shoppingcart = await ShoppingCart.find({ user: userId })

//         res.status(200).send(shoppingcart);
//     } catch (err) {
//         console.log(err.message);
//         res.status(500).send({ message: err.message });
//     }
// }

// exports.getActiveShoppingcartFromuser = async (req, res) => {
//     try {
//         const userId = req.params.user_id;
//         if (!userId) {
//             throw { message: "Authentication fail" };
//         }
//         const user = await User.findById(userId);

//         if (user.length === 0) {
//             throw { message: "User not found" };
//         }

//         const shoppingcart = await ShoppingCart.findOne({ user: userId, inUsed: true })

//         res.status(200).send(shoppingcart);
//     } catch (err) {
//         console.log(err.message);
//         res.status(500).send({ message: err.message });
//     }
// }

// exports.getShoppingCart = async (req, res) => {
//     try {
//         const { shoppingcart_id } = req.params;
//         console.log(req.params)

//         const data = await ShoppingCart.findById(shoppingcart_id);
//         console.log(data)
//         if (data && data.length === 0) {
//             throw { message: "Shopping cart Not Found" };
//         }
//         res.status(200).send(data);
//     } catch (err) {
//         console.log(err.message);
//         res.status(500).send({ message: err.message });
//     }
// }



// exports.addShoppingCart = async (req, res) => {
//     try {
//         const { user_id } = req.params;
//         if (!user_id) {
//             throw new Error("Authentication failed");
//         }
//         const user = await User.findById(user_id);
//         if (!user) {
//             throw new Error("User Not Found");
//         }
//         if (user.shoppingcart) {
//             const curShoppingCart = await ShoppingCart.findOne({ user: user._id, inUsed: true });
//             if (curShoppingCart) {
//                 return res.status(201).send(curShoppingCart);
//             }
//         }
//         const shoppingCart = new ShoppingCart({ user: user._id, inUsed: true });
//         await shoppingCart.save();
//         res.status(201).send(shoppingCart);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send({ message: err.message });
//     }
// }

// exports.deleteShoppingCart = async (req, res) => {
//     try {
//         const { shoppingcart_id } = req.params;
//         // console.log('kuy')

//         await ShoppingCartItem.deleteMany({ shoppingcart: { $in: shoppingcart_id } });
//         // console.log('kuy')

//         await ShoppingCart.deleteOne({ _id: shoppingcart_id });
//         // console.log('kuy')
//         res.status(204).send({ message: "Delete order item succesful" });
//     } catch (err) {
//         console.log(err.message);
//         res.status(500).send({ message: err.message });
//     }
// }