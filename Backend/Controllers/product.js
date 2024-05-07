const Product = require('../Models/Product.js')
const Category = require('../Models/Category.js');
const fs = require('fs');

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
        const data = await Product.findById(id)
        res.send(data);

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.addProduct = async (req, res) => {
    try {
        if (req.file) {
            req.body.image = fs.readFileSync(req.file.path, { encoding: 'base64' });
        }
        if (req.body.category == '') {
            req.body.category = undefined;
        } else {
            const categories = req.body.category.split(' ');
            let categoryArr = [];
            for(let category of categories) {
                categoryArr.push(await Category.findOne({ name: category }))
            }
            req.body.category = categoryArr;
        }    
        const newProd = new Product(req.body);
        await newProd.save();
        res.send(newProd)
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
            for(let category of categories) {
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

