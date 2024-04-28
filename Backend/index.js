const express = require('express');
const app = express();
const mongoose = require("mongoose");
require('dotenv').config()
const env = process.env;

const Product = require('./Models/Product.js')

app.use(express.json());

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

app.post('/Product/addProduct', async (req, res) => {
    try {
        const newProd = new Product(req.body);
        await newProd.save();
        res.send(req.body)
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
})

app.patch('/Product/:id/updateProduct', async (req, res) => {
    try {
        const { id } = req.params;
        const data = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
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
