const express = require('express');
const app = express();
const mongoose = require("mongoose");
cors = require('cors')
require('dotenv').config()
const env = process.env;
// const path = require('path');

const productRouters = require('./Routes/product')




app.set('view engine', 'ejs');

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use('/Images', express.static('Images'))


app.use('/', productRouters);

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
