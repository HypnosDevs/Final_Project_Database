const Category = require('../Models/Category.js');

exports.getAllCategory = async (req, res) => {
    try {
        const data = await Category.find()
        res.send(data);

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.getCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await Category.find({ _id: id })
        res.send(data);

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.addCategory = async (req, res) => {
    try {
        const { name } = req.params;
        if(await Category.find({ name: name }) == []){
            const newCategory = new Category(req.body);
            await newCategory.save();
            res.send(newCategory)
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