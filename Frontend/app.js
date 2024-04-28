const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = 7777;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.get('/', async (req, res) => {
    const data = await axios.get("http://localhost:8888/Product/getProduct");
    const products = data.data;
    // console.log(products);
    res.render('show', { products });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});