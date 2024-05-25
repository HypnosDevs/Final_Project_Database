const { pool } = require('../db/db.js');

// Get all discount categories
exports.getAllDiscountCategory = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM DiscountCategory');
        res.send(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: err.message });
    }
};

// Get a specific discount category by ID
exports.getDiscountCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM DiscountCategory WHERE Categoryid = ?', [id]);
        res.send(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: err.message });
    }
};

// Get discount categories by discount ID
exports.getDiscountCategoryByDiscountId = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM DiscountCategory WHERE discountID = ?', [id]);
        res.send(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: err.message });
    }
};

// Add a new discount category
exports.addDiscountCategory = async (req, res) => {
    try {
        const { categoryId, discountId } = req.body;

        await pool.query('INSERT INTO DiscountCategory (categoryID, discountID) VALUES (?, ?)', [categoryId, discountId]);
        res.send({ message: "Discount category added successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: err.message });
    }
};

// Delete discount categories by discount ID
exports.deleteDiscountCategoryByDiscountId = async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query('DELETE FROM DiscountCategory WHERE discountID = ?', [id]);
        res.send({ message: "Discount categories deleted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: err.message });
    }
};