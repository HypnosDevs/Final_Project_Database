const express = require('express');
const app = express();
const mongoose = require("mongoose");
cors = require('cors')
require('dotenv').config()
const env = process.env;
const path = require('path');

const Product = require('./Models/Product.js')

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

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if(
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

app.set('view engine', 'ejs');

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use('/Images', express.static('Images'))

app.get('/Product/getProduct', async (req, res) => {
    try {
        const data = await Product.find()
        res.send(data);

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
})

app.get('/Product/getProduct/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = await Product.find({ _id: id })
        res.send(data);

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
})

app.post('/Product/addProduct', upload.single('image'), async (req, res) => {
    try {
        const newProd = new Product(req.body);
        if(req.file) {
            newProd.image = req.file.path;
        }
        await newProd.save();
        res.send(req.body)
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
})

app.patch('/Product/:id/updateProduct', upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const data = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
        if(req.file) {
            data.image = req.file.path;
        }
        res.send(data)
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
})

app.delete('/Product/:id/deleteProduct', async (req, res) => {
    try {
        const { id } = req.params;
        const data = await Product.deleteOne({ _id: id })
        res.send(data)
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
})

app.get('/', (req, res) => {
    res.send("Hello world")
})



const database = () => {
    try {
        mongoose.connect(env.MONGOURI)
        console.log("connecting to db success")
    } catch (error) {
        console.log(error)
        console.log("Something went wrong when connecting to db")
    }
}

database();

const PORT = env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Open server on port ${PORT} complete`)
})
