const Product = require('../Models/Product.js')
const multer = require('multer');
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
        const data = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
        if (req.file) {
            data.image = req.file.path;
        }
        res.send(data)
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

exports.deleteProduct = async (req, res) => {
    async (req, res) => {
        try {
            const { id } = req.params;
            const data = await Product.deleteOne({ _id: id })
            res.send(data)
        } catch (err) {
            console.log(err.message);
            res.status(500).send({ message: err.message });
        }
    }
}