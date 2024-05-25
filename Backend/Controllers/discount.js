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
        res.send(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: err.message });
    }
};

// Add a new discount
exports.addDiscount = async (req, res) => {
    try {
        const { discount } = req.body;
        const [result] = await pool.query('INSERT INTO Discount (discount) VALUES (?)', [discount]);
        const newDiscountId = result.insertId;
        const [newDiscount] = await pool.query('SELECT * FROM Discount WHERE Discount_id = ?', [newDiscountId]);
        res.send(newDiscount);
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: err.message });
    }
};

// Update a discount by ID
exports.updateDiscount = async (req, res) => {
    try {
        const { id } = req.params;
        const { discount } = req.body;

        await pool.query('UPDATE Discount SET discount = ? WHERE Discount_id = ?', [discount, id]);

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