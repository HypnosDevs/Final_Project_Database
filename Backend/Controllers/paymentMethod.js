const { pool } = require('../db/db.js');

exports.getAllPaymentMethod = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM user_payment_method');
        res.send(rows);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
};

exports.getAllPaymentMethodFromUser = async (req, res) => {
    try {
        const { id } = req.params;
        const [userRows] = await pool.query('SELECT * FROM user WHERE user_id = ?', [id]);
        if (userRows.length === 0) {
            throw { message: "User not found" };
        }

        const [paymentMethods] = await pool.query('SELECT * FROM user_payment_method WHERE user_id = ?', [id]);
        userRows[0].paymentMethods = paymentMethods;

        res.send(userRows[0]);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
};

exports.getPaymentMethod = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM user_payment_method WHERE payment_id = ?', [id]);
        if (rows.length === 0) {
            throw { message: "Payment method not found" };
        }
        res.send(rows[0]);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
};

exports.addPaymentMethod = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { user_id, payment_type, account_name, account_number, expiry_date } = req.body;

        const [userRows] = await connection.query('SELECT * FROM user WHERE user_id = ?', [user_id]);
        if (userRows.length === 0) {
            throw { message: "User not found" };
        }

        const [paymentTypeRows] = await connection.query('SELECT * FROM payment_type WHERE payment_name = ?', [payment_type]);
        if (paymentTypeRows.length === 0) {
            throw { message: "Payment type not found" };
        }

        await connection.beginTransaction();
        const [result] = await connection.query('INSERT INTO user_payment_method (user_id, payment_type_id, account_name, account_number, payment_expiry_date) VALUES (?, ?, ?, ?, ?)', [user_id, paymentTypeRows[0].id, account_name, account_number, expiry_date]);
        await connection.commit();

        res.send({ message: "Payment method added successfully", payment_id: result.insertId });
    } catch (err) {
        await connection.rollback();
        console.log(err.message);
        res.status(500).send({ message: err.message });
    } finally {
        connection.release();
    }
};

exports.updatePaymentMethod = async (req, res) => {
    try {
        const { id } = req.params;
        const { account_number, expiry_date } = req.body;

        const [result] = await pool.query('UPDATE user_payment_method SET account_number = ?, payment_expiry_date = ? WHERE payment_id = ?', [account_number, expiry_date, id]);
        if (result.affectedRows === 0) {
            throw { message: "Payment method not found" };
        }

        const [updatedPaymentMethod] = await pool.query('SELECT * FROM user_payment_method WHERE payment_id = ?', [id]);
        res.send(updatedPaymentMethod[0]);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
};

exports.deletePaymentMethod = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { id } = req.params;

        await connection.beginTransaction();
        const [result] = await connection.query('DELETE FROM user_payment_method WHERE payment_id = ?', [id]);
        if (result.affectedRows === 0) {
            throw { message: "Payment method not found" };
        }

        await connection.query('UPDATE user SET paymentmethod = NULL WHERE paymentmethod = ?', [id]);
        await connection.commit();

        res.send({ message: "Payment method deleted successfully" });
    } catch (err) {
        await connection.rollback();
        console.log(err.message);
        res.status(500).send({ message: err.message });
    } finally {
        connection.release();
    }
};
