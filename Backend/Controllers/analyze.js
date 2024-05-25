
const { pool } = require('../db/db.js');


exports.bestCategory = async (req, res) => {
    try {
        const query = `
            SELECT 
                c.category_name AS categoryName,
                SUM(oi.qty) AS totalQty,
                SUM((oi.qty * oi.price) - oi.discount) AS totalSales
            FROM 
                order_item oi
            INNER JOIN 
                product p ON oi.product_id = p.id
            INNER JOIN 
                ProductCategory pc ON p.id = p.product_id
            INNER JOIN 
                category c ON pc.category_id = c.category_id
            GROUP BY 
                c.category_name
            ORDER BY 
                totalQty DESC;
        `;

        const [data] = await pool.query(query);
        res.status(200).json(data);
    } catch (err) {
        console.error("Error in bestCategory:", err);
        res.status(500).json({ message: err.message });
    }
};

exports.bestCategoryFromUser = async (req, res) => {
    try {
        const { user_id } = req.params;

        const query = `
            SELECT 
                c.category_id AS categoryId,
                c.category_name AS categoryName,
                SUM(oi.qty) AS totalQty,
                SUM((oi.qty * oi.price) - oi.discount) AS totalSales
            FROM 
                \`order\` o
            INNER JOIN 
                order_item oi ON o.order_id = oi.order_id
            INNER JOIN 
                product p ON oi.product_id = p.id
            INNER JOIN 
                ProductCategory pc ON p.id = p.product_id
            INNER JOIN 
                category c ON pc.category_id = c.category_id
            WHERE 
                o.user_id = ?
            GROUP BY 
                c.category_id, c.category_name
            ORDER BY 
                totalQty DESC;
        `;

        const [data] = await pool.query(query, [user_id]);
        res.status(200).json(data);
    } catch (err) {
        console.error("Error in bestCategoryFromUser:", err);
        res.status(500).json({ message: err.message });
    }
};

exports.getUserTotalSpending = async (req, res) => {
    try {
        const { user_id } = req.params;

        // SQL query to calculate total spending for a user
        const query = `
            SELECT SUM((oi.qty * oi.price) - oi.discount) AS totalSpending
            FROM \`order\` o
            JOIN order_item oi ON o.order_id = oi.order_id
            WHERE o.user_id = ?
        `;

        const [rows] = await pool.query(query, [user_id]);

        // Extracting total spending from the result
        const totalSpendingResult = rows[0].totalSpending || 0;

        res.status(200).json({ totalSpending: totalSpendingResult });

    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};


exports.getProductSold = async (req, res) => {
    try {
        // SQL query to calculate total sales for each product
        const query = `
            SELECT 
                p.product_id AS productId,
                p.product_name AS productName,
                SUM(oi.qty) AS totalQty,
                SUM((oi.qty * oi.price) - oi.discount) AS totalSales
            FROM 
                product p
            JOIN 
                order_item oi ON p.product_id = oi.product_id
            GROUP BY 
                p.product_id, p.product_name
            ORDER BY 
                totalQty DESC
        `;

        const [rows] = await pool.query(query);

        res.status(200).json(rows);

    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getBestProvince = async (req, res) => {
    try {
        const query = `
            SELECT 
                o.province AS province,
                SUM(oi.qty) AS totalQty,
                SUM((oi.qty * oi.price) - oi.discount) AS totalSales
            FROM \`order\` o
            JOIN order_item oi ON o.order_id = oi.order_id
            JOIN product p ON oi.product_id = p.id
            GROUP BY o.province
            ORDER BY totalQty DESC
        `;

        const [rows] = await pool.query(query);
        res.status(200).send(rows);
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getTotalSpending = async (req, res) => {
    try {
        const query = `
            SELECT 
                SUM(oi.qty) AS totalQty,
                SUM((oi.qty * oi.price) - oi.discount) AS totalSales
            FROM order_item oi
            JOIN product p ON oi.product_id = p.id
        `;

        const [rows] = await pool.query(query);
        res.status(200).send(rows[0]);
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};