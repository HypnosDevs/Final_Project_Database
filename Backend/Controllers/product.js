const Product = require('../Models/Product.js')
<<<<<<< HEAD
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Images');
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname));
    }
})

exports.upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype == 'image/png' ||
            file.mimetype == 'image/jpg' ||
            file.mimetype == 'image/jpeg'
        ) {
            cb(null, true);
        } else {
            console.log(file);
            console.log('Please only use PNG, JPG and JPEG files. Thank you!');
            cb(null, false);
        }
    }
})

=======
const uploadModule = require('../Middleware/upload')
const toDataURL = uploadModule.otherMethod;
const path = require('path');
const fs = require('fs');
>>>>>>> 6f3472557d85a9fca5fb32e03bf6d6287d0482c9

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
        if (req.file) {
            req.body.image = fs.readFileSync(req.file.path, {encoding: 'base64'});
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
<<<<<<< HEAD
            req.body.image = req.file.path;
        }
        const data = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
=======
            req.body.image = fs.readFileSync(req.file.path, {encoding: 'base64'});
        }
        const data = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
        await data.save();
>>>>>>> 6f3472557d85a9fca5fb32e03bf6d6287d0482c9
        res.send(data)
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
<<<<<<< HEAD
        console.log('here')
        const data = await Product.deleteOne({ _id: id })
        console.log('here')
=======
        const data = await Product.deleteOne({ _id: id })
>>>>>>> 6f3472557d85a9fca5fb32e03bf6d6287d0482c9
        res.send(data)
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}
