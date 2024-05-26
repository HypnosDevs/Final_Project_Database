const { pool } = require('../db/db.js');

exports.getAllPaymentType = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM payment_type');
        res.send(rows);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
};

exports.getPaymentTypeFromUserPaymentMethod = async (req, res) => {
    try {
        const { payment_method_id } = req.params;
        const [rows] = await pool.query(`
            SELECT pt.* FROM payment_type pt
            JOIN user_payment_method upm ON pt.payment_type_id = upm.payment_type_id
            WHERE upm.payment_id = ?`, [payment_method_id]);
        
        if (rows.length === 0) {
            throw { message: "Payment type not found" };
        }

        res.send(rows[0]);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
};

exports.getPaymentType = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM payment_type WHERE payment_type_id = ?', [id]);
        
        if (rows.length === 0) {
            throw { message: "Payment type not found" };
        }

        res.send(rows[0]);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
};

exports.addPaymentType = async (req, res) => {
    try {
        const { name } = req.body;

        const [existingPaymentType] = await pool.query('SELECT * FROM payment_type WHERE payment_name = ?', [name]);

        if (existingPaymentType.length === 0) {
            const [result] = await pool.query('INSERT INTO payment_type (payment_name) VALUES (?)', [name]);
            const newPaymentType = { id: result.insertId, name };
            res.send(newPaymentType);
        } else {
            res.send({ message: "Payment type already exists" });
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
};

exports.deletePaymentType = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM user_payment_method WHERE payment_type_id = ?', [id]);
        const [result] = await pool.query('DELETE FROM payment_type WHERE payment_type_id = ?', [id]);
        
        if (result.affectedRows === 0) {
            throw { message: "Payment type not found" };
        }

        res.send({ message: "Payment type deleted successfully" });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
};
