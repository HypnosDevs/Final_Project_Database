const { pool } = require('../db/db.js');

// Get all discounts
exports.getAllDiscount = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Discount ORDER BY discount DESC');
        res.send(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: err.message });
    }
};

// Get all discounts from a category
exports.getAllDiscountFromCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query(`
            SELECT d.* 
            FROM DiscountCategory dc 
            JOIN Discount d ON dc.discountID = d.Discount_id 
            WHERE dc.categoryID = ?
        `, [id]);
        res.send(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: err.message });
    }
};

// Get a specific discount by ID
exports.getDiscount = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM Discount WHERE Discount_id = ?', [id]);
        res.send(rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: err.message });
    }
};

// Add a new discount
exports.addDiscount = async (req, res) => {
    try {
        const { discount, min_price, max_discount } = req.body;
        const sql = 'INSERT INTO Discount (discount, min_price, max_discount) VALUES (?, ?, ?)';
        const values = [discount, min_price, max_discount];

        const [result] = await pool.query(sql, values);
        const newDiscountId = result.insertId;

        const [newDiscount] = await pool.query('SELECT * FROM Discount WHERE Discount_id = ?', [newDiscountId]);

        res.send(newDiscount[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: err.message });
    }
};

// Update a discount by ID
exports.updateDiscount = async (req, res) => {
    try {
        const { id } = req.params;
        const { discount, min_price, max_discount } = req.body;

        await pool.query('UPDATE Discount SET discount = ?,min_price = ?,max_discount = ? WHERE Discount_id = ?', [discount, min_price, max_discount, id]);

        const [updatedDiscount] = await pool.query('SELECT * FROM Discount WHERE Discount_id = ?', [id]);

        res.send(updatedDiscount);
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: err.message });
    }
};

// Delete a discount by ID
exports.deleteDiscount = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM Discount WHERE Discount_id = ?', [id]);
        res.send({ message: "Discount deleted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: err.message });
    }
};

exports.checkDiscountMatch = async (req, res) => {
    try {
        const { discount, min_price, max_discount } = req.body;

        const [rows] = await pool.query(
            'SELECT * FROM Discount WHERE discount = ? AND min_price = ? AND max_discount = ?',
            [discount, min_price, max_discount]
        );

        console.log('Query parameters:', discount, min_price, max_discount);
        console.log('Query result:', rows);

        let data = {
            isExists: rows.length > 0 ? "1" : "0", // Set isExists based on rows length
            discountMatch: rows.length > 0 ? rows[0] : null // Optionally return the matched discount details
        };

        res.send(data);
    } catch (err) {
        console.error('Error executing query:', err.message);
        res.status(500).send({ message: err.message });
    }
}