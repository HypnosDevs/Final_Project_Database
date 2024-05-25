// const Address = require('../Models/Address');
// const Order = require('../Models/Order');
// const PaymentMethod = require('../Models/PaymentMethod');
// const User = require('../Models/User');
const bcrypt = require('bcrypt');
const { pool } = require('../db/db.js');


exports.getAllUsers = async (req, res) => {
    try {
        console.log("get all users session", req.session)
        if (!req.session.userId) {
            throw { message: 'Authentication fail' };
        }
        const [users] = await pool.query('SELECT * FROM user');
        return res.status(200).json(users);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
};

exports.getUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).send({ message: 'ID parameter is missing' });
        }

        const [users] = await pool.query('SELECT * FROM user WHERE user_id = ?', [id]);
        const user = users[0];

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        delete user.password; // Remove password field
        res.status(200).send(user);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

exports.addUser = async (req, res) => {
    try {
        const { username, password, firstname, lastname, gender, email, user_role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const insertUserQuery = `
            INSERT INTO user (username, password, firstname, lastname, gender, email, user_role)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        await pool.query(insertUserQuery, [username, hashedPassword, firstname, lastname, gender, email, user_role]);

        res.sendStatus(201);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
};

exports.addUserWithAddress = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const { user, address } = req.body;
        const { username, password, firstname, lastname, gender, email, user_role } = user;
        const hashedPassword = await bcrypt.hash(password, 10);

        const insertUserQuery = `
            INSERT INTO user (username, password, firstname, lastname, gender, email, user_role)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [userResult] = await connection.query(insertUserQuery, [username, hashedPassword, firstname, lastname, gender, email, user_role]);

        const userId = userResult.insertId;

        const insertAddressQuery = `
            INSERT INTO address (user_id, address_name, province, amphoe, district, address_line1, address_line2, postal_code, country_name, tel_no)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const { address_name, province, amphoe, district, address_line1, address_line2, postal_code, country_name, tel_no } = address;
        await connection.query(insertAddressQuery, [userId, address_name, province, amphoe, district, address_line1, address_line2, postal_code, country_name, tel_no]);

        await connection.commit();
        res.sendStatus(201);
    } catch (err) {
        await connection.rollback();
        console.log(err.message);
        res.status(500).send({ message: err.message });
    } finally {
        connection.release();
    }
};

exports.editUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).send({ message: 'ID parameter is missing' });
        }

        const { username, password, firstname, lastname, gender, email, user_role } = req.body;

        const hash = await bcrypt.hash(password, 10);

        const updateUserQuery = `
            UPDATE user SET username = ?, password = ?, firstname = ?, lastname = ?, gender = ?, email = ?, user_role = ?
            WHERE user_id = ?
        `;
        const [result] = await pool.query(updateUserQuery, [username, hash, firstname, lastname, gender, email, user_role, id]);

        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'User not found' });
        }

        res.status(200).send({ message: 'User updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

exports.deleteUser = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).send({ message: 'ID parameter is missing' });
        }

        await connection.beginTransaction();

        const [userResult] = await connection.query('SELECT * FROM user WHERE user_id = ?', [id]);
        const user = userResult[0];

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        await connection.query('DELETE FROM address WHERE user_id = ?', [id]);
        await connection.query('DELETE FROM user_payment_method WHERE user_id = ?', [id]);
        await connection.query('DELETE FROM user WHERE user_id = ?', [id]);

        await connection.commit();
        res.status(200).send({ message: 'User deleted successfully' });
    } catch (err) {
        await connection.rollback();
        console.error(err);
        res.status(500).send({ message: 'Internal Server Error' });
    } finally {
        connection.release();
    }
};

exports.getAllUsernameAndEmail = async (req, res) => {
    try {
        const [data] = await pool.query('SELECT username, email FROM user');
        res.status(200).send(data);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

exports.addOrder = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { order } = req.body;
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

        await connection.beginTransaction();

        const insertOrderQuery = `
            INSERT INTO \`order\` (user_id, payment_type, account_number, address_name, province, district, address_line1, address_line2, postal_code, country_name)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const { payment_type, account_number, address_name, province, district, address_line1, address_line2, postal_code, country_name } = order;
        const [orderResult] = await connection.query(insertOrderQuery, [userId, payment_type, account_number, address_name, province, district, address_line1, address_line2, postal_code, country_name]);

        const orderId = orderResult.insertId;

        for (const item of order.items) {
            const insertOrderItemQuery = `
                INSERT INTO order_item (order_id, product_id, product_name, product_image, discount, price, order_status, qty)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const { product_id, product_name, product_image, discount, price, order_status, qty } = item;
            await connection.query(insertOrderItemQuery, [orderId, product_id, product_name, product_image, discount, price, order_status, qty]);
        }

        await connection.commit();
        res.status(200).send({ message: 'Order added successfully' });
    } catch (err) {
        await connection.rollback();
        console.error(err);
        res.status(500).send({ message: 'Internal Server Error' });
    } finally {
        connection.release();
    }
};





























// exports.getAllUsers = async (req, res) => {
//     try {
//         console.log("get all users session", req.session)
//         if (!req.session.userId) {
//             throw { message: 'Authentication fail' };
//         }
//         const userData = await User.find({});
//         return res.status(200).json(userData);

//     }
//     catch (err) {
//         console.log(err.message);
//         res.status(500).send({ message: err.message });
//     }
// }

// exports.getUser = async (req, res) => {
//     try {
//         const { id } = req.params;

//         if (!id) {
//             return res.status(400).send({ message: 'ID parameter is missing' });
//         }

//         const user = await User.findById(id, { password: 0 });

//         if (!user) {
//             return res.status(404).send({ message: 'User not found' });
//         }

//         res.status(200).send(user);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send({ message: 'Internal Server Error' });
//     }
// };

// exports.addUser = async (req, res) => {
//     try {

//         const newUser = new User(req.body);
//         await newUser.save();
//         res.sendStatus(201);
//     } catch (err) {
//         console.log(err.message);
//         res.status(500).send({ message: err.message });
//     }
// }

// exports.addUserWithAddress = async (req, res) => {
//     try {

//         const newUser = new User(req.body.user);
//         const newAddress = new Address(req.body.address);
//         await newAddress.save();
//         newUser.address.push(newAddress);
//         await newUser.save();
//         res.sendStatus(201);
//     } catch (err) {
//         console.log(err.message);
//         res.status(500).send({ message: err.message });
//     }
// }

// exports.editUser = async (req, res) => {
//     try {
//         const { id } = req.params;

//         // Input validation
//         if (!id) {
//             return res.status(400).send({ message: 'ID parameter is missing' });
//         }

//         const hash = await bcrypt.hash(req.body.password, 10);
//         req.body.password = hash;

//         // Updating the user data
//         const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

//         // If user not found
//         if (!updatedUser) {
//             return res.status(404).send({ message: 'User not found' });
//         }

//         // Sending the updated user data
//         res.status(200).send(updatedUser);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send({ message: 'Internal Server Error' });
//     }
// };

// // wait for payment method  shopping cart
// exports.deleteUser = async (req, res) => {
//     try {
//         const { id } = req.params;

//         if (!id) {
//             return res.status(400).send({ message: 'ID parameter is missing' });
//         }

//         const user = await User.findById(id);

//         // Delete all addresses associated with the user
//         await Address.deleteMany(
//             {
//                 id: { $in: user.address }
//             });

//         await PaymentMethod.deleteMany(
//             {
//                 id: { $in: user.paymentmethod }
//             });


//         const deletedUser = await User.findByIdAndDelete(id);

//         if (!deletedUser) {
//             return res.status(404).send({ message: 'User not found' });
//         }

//         res.status(200).send({ message: 'User deleted successfully' });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send({ message: 'Internal Server Error' });
//     }
// };

// exports.getAllUsernameAndEmail = async (req, res) => {
//     try {

//         const data = await User.find({}, { username: 1, email: 1, _id: 0 });
//         res.status(200).send(data);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send({ message: 'Internal Server Error' });
//     }
// };

// exports.addOrder = async (req, res) => {
//     try {
//         const order = req.body();
//         const data = await User.findById(req.session.userId);
//         data.order.push(order);
//         await data.save();
//         res.status(200).send({ message: 'Create add order to user success' });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send({ message: 'Internal Server Error' });
//     }
// };
