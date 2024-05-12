const Category = require('../Models/Category.js');
const Product = require('../Models/Product.js');

exports.getAllCategory = async (req, res) => {
    try {
        const data = await Category.find()
        res.send(data);

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.getAllCategoryFromProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await Product.findById(id).populate('category');
        res.send(data);

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.getCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await Category.findById({ _id: id })
        res.send(data);

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.addCategory = async (req, res) => {
    try {
        const { name } = req.params;
        const existingCategory = await Category.findOne({ name: name });

        if (!existingCategory) {
            req.body.name = name;
            const newCategory = new Category(req.body);
            await newCategory.save();
            res.send(newCategory);
        } else {
            res.send(existingCategory);
        }

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await Category.deleteOne({ _id: id })
        res.send(data)
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}