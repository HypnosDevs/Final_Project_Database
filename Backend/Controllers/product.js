const Product = require('../Models/Product.js')

exports.getAllProduct = async (req, res) => {
    try {
        const data = await Product.find()
        res.send(data);

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.getProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await Product.find({ _id: id })
        res.send(data);

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.addProduct = async (req, res) => {
    try {
        const newProd = new Product(req.body);
        if (req.file) {
            newProd.image = req.file.path;
        }
        await newProd.save();
        res.send(req.body)
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.file) {
            req.body.image = req.file.path;
        }
        const data = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
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
