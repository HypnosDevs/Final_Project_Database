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
        // userRows[0].paymentMethods = paymentMethods;

        //res.send(userRows[0]);
        res.send(paymentMethods);
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
        const { id } = req.params;
        const { payment_type, account_name, account_number, payment_expiry_date } = req.body;

        const [userRows] = await connection.query('SELECT * FROM user WHERE user_id = ?', [id]);
        if (userRows.length === 0) {
            throw { message: "User not found" };
        }

        const [paymentTypeRows] = await connection.query('SELECT * FROM payment_type WHERE payment_name = ?', [payment_type]);
        if (paymentTypeRows.length === 0) {
            throw { message: "Payment type not found" };
        }

        await connection.beginTransaction();
        const [result] = await connection.query('INSERT INTO user_payment_method (user_id, payment_type_id, account_name, account_number, payment_expiry_date) VALUES (?, ?, ?, ?, ?)', [id, paymentTypeRows[0].payment_type_id, account_name, account_number, payment_expiry_date]);
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
        const { account_name, account_number, payment_expiry_date } = req.body;

        let updateQuery = `UPDATE user_payment_method SET`;
        let updateValue = [];

        if (account_name !== undefined) updateQuery += ' account_name = ?,', updateValue.push(account_name);
        if (account_number !== undefined) updateQuery += ' account_number = ?,', updateValue.push(account_number);
        if (payment_expiry_date !== undefined) updateQuery += ' payment_expiry_date = ?,', updateValue.push(payment_expiry_date);

        if (updateQuery.slice(-1) === ',') updateQuery = updateQuery.slice(0, -1);
        else {
            return res.status(200).send({ message: 'Payment method update nothing'});
        }
        updateQuery += ' WHERE payment_id = ?';
        updateValue.push(id);

        const [result] = await pool.query(updateQuery, updateValue);

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
