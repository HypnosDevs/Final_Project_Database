const fs = require('fs');
const { pool } = require('../db/db.js');

exports.getAllProduct = async (req, res) => {
    try {
        const [data] = await pool.query('SELECT * FROM product');
        res.send(data);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
};

exports.getProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const [data] = await pool.query('SELECT * FROM product WHERE id = ?', [id]);

        if (data.length === 0) {
            res.status(404).send({ message: 'Product not found' });
        } else {
            res.send(data[0]);
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
};


exports.addProduct = async (req, res) => {
    try {
        if (req.file) {
            req.body.image = fs.readFileSync(req.file.path, { encoding: 'base64' });
        }

        // Handle category
        let categoryIds = [];
        if (req.body.category) {
            const categories = req.body.category.split(' ');
            for (let category of categories) {
                const [categoryResult] = await pool.query('SELECT category_id FROM category WHERE category_name = ?', [category]);
                if (categoryResult.length > 0) {
                    categoryIds.push(categoryResult[0].category_id);
                } else {
                    const [result] = await pool.query('INSERT INTO category (category_name) VALUES (?)', [category]);
                    categoryIds.push(result.insertId);
                }
            }
        }

        // Insert product
        const { product_name, product_description, price, stock } = req.body;
        const [productResult] = await pool.query(
            'INSERT INTO product (product_name, product_description, product_image, price, stock) VALUES (?, ?, ?, ?, ?)',
            [product_name, product_description, req.body.image, price, stock]
        );

        const productId = productResult.insertId;

        // Link product with categories
        for (let categoryId of categoryIds) {
            await pool.query('INSERT INTO ProductCategory (product_id, category_id) VALUES (?, ?)', [productId, categoryId]);
        }

        res.send('Product and categories added successfully');
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
};


exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { product_name, product_description, price, stock, category } = req.body;

        // Read and encode image if provided
        let image = null;
        if (req.file) {
            image = fs.readFileSync(req.file.path, { encoding: 'base64' });
        }

        // Update product details
        const updateProductQuery = `
            UPDATE product 
            SET product_name = ?, 
                product_description = ?, 
                product_image = ?, 
                price = ?, 
                stock = ?
            WHERE id = ?
        `;
        const updateProductValues = [product_name, product_description, image, price, stock, id];
        await pool.query(updateProductQuery, updateProductValues);

        if (category) {
            const categories = category.split(' ');
            for (let categoryName of categories) {
                const [categoryResult] = await pool.query('SELECT category_id FROM category WHERE category_name = ?', [categoryName]);
                let categoryId;
                if (categoryResult.length > 0) {
                    categoryId = categoryResult[0].category_id;
                } else {
                    const [result] = await pool.query('INSERT INTO category (category_name) VALUES (?)', [categoryName]);
                    categoryId = result.insertId;
                }

                const [existingAssoc] = await pool.query('SELECT * FROM ProductCategory WHERE product_id = ? AND category_id = ?', [id, categoryId]);
                if (existingAssoc.length === 0) {
                    await pool.query('INSERT INTO ProductCategory (product_id, category_id) VALUES (?, ?)', [id, categoryId]);
                }
            }
        }

        res.send('Product updated successfully');
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: 'Failed to update product. Please try again.' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const [existingProduct] = await pool.query('SELECT * FROM product WHERE id = ?', [id]);
        if (existingProduct.length === 0) {
            return res.status(404).send({ message: 'Product not found' });
        }
        await pool.query('DELETE FROM product WHERE id = ?', [id]);
        await pool.query('DELETE FROM ProductCategory WHERE product_id = ?', [id]);
        res.send({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: 'Failed to delete product. Please try again.' });
    }
};
