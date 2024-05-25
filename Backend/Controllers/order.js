const { pool } = require('../db/db.js');

// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM `order`');
        res.status(200).send(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: err.message });
    }
};

// Get a specific order by ID
exports.getOrder = async (req, res) => {
    try {
        const { order_id } = req.params;
        const [rows] = await pool.query('SELECT * FROM `order` WHERE order_id = ?', [order_id]);

        if (rows.length === 0) {
            res.status(404).send({ message: "Order item Not Found" });
            return;
        }

        res.status(200).send(rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: err.message });
    }
};

// Get orders by user ID
exports.getOrderFromUser = async (req, res) => {
    try {
        const { user_id } = req.params;
        const [rows] = await pool.query('SELECT * FROM `order` WHERE user_id = ?', [user_id]);

        if (rows.length === 0) {
            res.status(404).json({ message: "Order Not Found" });
            return;
        }

        res.status(200).send(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: err.message });
    }
};

// Add a new order
exports.addOrder = async (req, res) => {
    try {
        const { payment_id, user_id } = req.params;

        // Check if payment method exists
        const [paymentMethod] = await pool.query('SELECT * FROM user_payment_method WHERE payment_id = ?', [payment_id]);
        if (paymentMethod.length === 0) {
            res.status(404).send({ message: "Payment method Not Found" });
            return;
        }

        // Check if user exists
        const [user] = await pool.query('SELECT * FROM user WHERE user_id = ?', [user_id]);
        if (user.length === 0) {
            res.status(404).send({ message: "User Not Found" });
            return;
        }

        // Insert new order
        const { payment_type, account_name, account_number, address_name, province, amphoe, district, address_line1, address_line2, postal_code, country_name } = req.body;
        const [result] = await pool.query(
            'INSERT INTO `order` (user_id, payment_type, account_name, account_number, address_name, province, amphoe, district, address_line1, address_line2, postal_code, country_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [user_id, payment_type, account_name, account_number, address_name, province, amphoe, district, address_line1, address_line2, postal_code, country_name]
        );

        const newOrderId = result.insertId;
        res.status(201).send({ order_id: newOrderId });
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: err.message });
    }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
    try {
        const { order_id } = req.params;

        // Delete order items
        await pool.query('DELETE FROM order_item WHERE order_id = ?', [order_id]);

        // Delete the order
        await pool.query('DELETE FROM `order` WHERE order_id = ?', [order_id]);

        res.status(204).send({ message: "Delete order item successful" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: err.message });
    }
};
