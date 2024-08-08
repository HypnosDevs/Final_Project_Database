const { pool } = require('../db/db.js');


exports.getAllCategory = async (req, res) => {
    try {
        const query = `
            SELECT *
            FROM category
        `;
        const [rows] = await pool.query(query);
        res.send(rows);
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getAllCategoryFromProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT c.*
            FROM category c
            JOIN ProductCategory pc ON c.category_id = pc.category_id
            JOIN product p ON pc.product_id = p.product_id
            WHERE p.product_id = ?
        `;
        const [rows] = await pool.query(query, [id]);
        res.send(rows);
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT *
            FROM category
            WHERE category_id = ?
        `;
        const [rows] = await pool.query(query, [id]);
        res.send(rows[0]);
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getCategoryFromDiscountCategoryId = async (req, res) => {
    try {
        const { discount_category_id } = req.params;
        const query = `
            SELECT c.*
            FROM category c
            JOIN discountcategory dc ON c.discount_category_id = dc.discount_category_id
            WHERE dc.discount_category_id = ?
        `;
        const [rows] = await pool.query(query, [discount_category_id]);
        res.send(rows[0]);
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.addCategory = async (req, res) => {
    try {
        const { name } = req.params;

        // Check if category already exists
        const [rows] = await pool.query('SELECT * FROM category WHERE category_name = ?', [name]);

        if (rows.length === 0) {
            // Category does not exist, insert new category
            const [result] = await pool.query('INSERT INTO category (category_name, created_at) VALUES (?, NOW())', [name]);
            const newCategoryId = result.insertId;

            // Retrieve the newly inserted category
            const [newCategoryRows] = await pool.query('SELECT * FROM category WHERE category_id = ?', [newCategoryId]);
            const newCategory = newCategoryRows[0];

            res.status(201).send(newCategory);
        } else {
            // Category already exists
            const existingCategory = rows[0];
            res.status(200).send(existingCategory);
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: err.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the category exists before deleting
        const [existingCategoryRows] = await pool.query('SELECT * FROM category WHERE category_id = ?', [id]);

        if (existingCategoryRows.length === 0) {
            // Category not found
            return res.status(404).send({ message: 'Category not found' });
        }

        // Delete the category
        await pool.query('DELETE FROM category WHERE category_id = ?', [id]);

        res.status(200).send({ message: 'Category deleted successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: err.message });
    }
};

exports.deleteProductCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete the category
        await pool.query('DELETE FROM ProductCategory WHERE product_id = ?', [id]);

        res.status(200).send({ message: 'ProductCategory deleted successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: err.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {

        const { id } = req.params;
        const { category } = req.body;

        await pool.query('UPDATE Category SET category_name = ? WHERE category_id = ?', [category, id]);

        res.status(200).send({ message: 'ProductCategory deleted successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: err.message });
    }
}