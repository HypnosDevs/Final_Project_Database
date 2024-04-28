const express = require('express');
const app = express();
const mongoose = require("mongoose");
require('dotenv').config()
const env = process.env;

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
    console.log(`Open server on port ${env.PORT} complete`)
})
