const { pool } = require('../db/db.js');

exports.getAllOrderItem = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM order_item ORDER BY created_at DESC');
        res.status(200).send(rows);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
};

exports.getOrderItem = async (req, res) => {
    try {
        const { order_id, product_id } = req.params;
        const [rows] = await pool.query('SELECT * FROM order_item WHERE order_id = ? AND product_id = ?', [order_id, product_id]);
        if (rows.length === 0) {
            throw { message: "Order item Not Found" };
        }
        res.status(200).send(rows[0]);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
};

exports.getOrderItemFromOrder = async (req, res) => {
    try {
        const { order_id } = req.params;
        const [rows] = await pool.query('SELECT * FROM order_item WHERE order_id = ?', [order_id]);
        if (rows.length === 0) {
            return res.status(200).send(null);
        }
        res.status(200).send(rows);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
};

exports.getProductFromOrderItem = async (req, res) => {
    try {
        const { order_id, product_id } = req.params;
        const [rows] = await pool.query('SELECT * FROM order_item WHERE order_id = ? AND product_id = ?', [order_id, product_id]);
        if (rows.length === 0) {
            throw { message: "Data (product in that order id) Not Found" };
        }
        const [productRows] = await pool.query('SELECT * FROM product WHERE product_id = ?', [product_id]);
        if (productRows.length === 0) {
            throw { message: "Product Not Found" };
        }
        res.status(200).send({ orderItem: rows[0], product: productRows[0] });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
};

exports.addOrderItem = async (req, res) => {
    try {
        const { order_id, product_id } = req.params;
        const [orderRows] = await pool.query('SELECT * FROM `order` WHERE order_id = ?', [order_id]);
        if (orderRows.length === 0) {
            throw { message: "Order Not Found" };
        }
        const [productRows] = await pool.query('SELECT * FROM product WHERE product_id = ?', [product_id]);
        if (productRows.length === 0) {
            throw { message: "Product Not Found" };
        }
        const product = productRows[0];
        const orderItem = {
            order_id,
            product_id,
            product_name: product.product_name,
            product_image: product.product_image,
            price: product.price,
            qty: req.body.qty,
            discount: req.body.discount || 0,
            order_status: req.body.order_status
        };

        await pool.query('INSERT INTO order_item SET ?', orderItem);
        await pool.query('UPDATE product SET stock = ? WHERE product_id = ?', [product.stock - orderItem.qty, product_id]);

        res.status(201).send({ message: "Create order item successful" });
    } catch (err) {
        await connection.rollback();
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
};

exports.updateOrderItemStatus = async (req, res) => {
    try {
        const { order_item_id } = req.params;
        const { status } = req.body;
        const [result] = await pool.query('UPDATE order_item SET order_status = ? WHERE order_item_id = ?', [status, order_item_id]);
        if (result.affectedRows === 0) {
            throw { message: "Order item Not Found" };
        }
        res.status(204).send({ message: "Updated order item status successful" });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
};

exports.deleteOrderItem = async (req, res) => {
    try {
        const { order_id, product_id } = req.params;
        const [result] = await pool.query('DELETE FROM order_item WHERE order_id = ? AND product_id = ?', [order_id, product_id]);
        if (result.affectedRows === 0) {
            throw { message: "Order item Not Found" };
        }
        res.status(204).send({ message: "Delete order item successful" });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
};

exports.deleteOrderItemByOrderItemId = async (req, res) => {
    try {
        const { order_item_id } = req.params;
        const [result] = await pool.query('DELETE FROM order_item WHERE order_item_id = ?', [order_item_id]);
        if (result.affectedRows === 0) {
            throw { message: "Order item Not Found" };
        }
        res.status(204).send({ message: "Delete order item successful" });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
};
