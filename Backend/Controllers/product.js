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
        if (req.body.category == '') {
            req.body.category = undefined;
        } else {
            const categories = req.body.category.split(' ');
            for (let category of categories) {
                const [categoryResult] = await pool.query('SELECT category_id FROM category WHERE category_name = ?', [category]);
                if (categoryResult.length > 0) {
                    continue;
                }
                else {
                    await pool.query(
                        `INSERT INTO product (category_id, product_name, product_description, product_image, price, stock) VALUES (?, ?, ?, ?, ?, ?)`,
                        [category_id, product_name, product_description, product_image, price, stock]
                    );
                }
            }
        }

        res.send('add product & cat success')
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}


exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.file) {
            req.body.image = fs.readFileSync(req.file.path, { encoding: 'base64' });
        }

        if (req.body.category == '') {
            req.body.category = undefined;
        } else {
            const categories = req.body.category.split(' ');
            let categoryArr = [];
            for (let category of categories) {
                categoryArr.push(await Category.findOne({ name: category }))
            }
            req.body.category = categoryArr;
        }

        const data = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        await data.save();
        res.send(data)
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await Product.deleteOne({ _id: id })
        res.send(data)
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

