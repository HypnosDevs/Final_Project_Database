const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios');

require('dotenv').config()
const env = process.env;


app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'assets')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))




const PORT = env.PORT || 9090;


app.get('/', (req, res) => {
    res.render('index')
})

app.get('/signIn', (req, res) => {
    res.render('SignIn')
})

app.get('/shop', (req, res) => {
    res.render('shop')
})

app.get('/about', (req, res) => {
    res.render('about')
})

app.get('/cart', (req, res) => {
    res.render('cart')
})

app.get('/contact', (req, res) => {
    res.render('contact')
})

app.get('/register', (req, res) => {
    res.render('Register');
})

app.get('/Sup-produect', (req, res) => {
    res.render('sproduct')
})

app.post('/register', async (req, res) => {
    try {
        // console.log(req.body);
        // console.log("here")
        const response = await axios.post("http://localhost:8888/api/Authentication/register", req.body);
        console.log("register success");
        res.redirect('/login');
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
})

app.listen(PORT, () => {
    console.log(`Open server on port ${PORT} complete`)
})
