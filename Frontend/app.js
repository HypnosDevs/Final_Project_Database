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
    res.render('index');
})


app.get('/signIn', (req, res) => {
    res.render('SignIn')
})

app.get('/shop', (req, res) => {
    res.render('shop')
})

// app.get('/about', (req, res) => {
//     res.render('about')
// })

app.get('/cart', (req, res) => {
    res.render('cart')
})

// app.get('/contact', (req, res) => {
//     res.render('contact')
// })

app.get('/register', (req, res) => {
    res.render('Register');
})

app.get('/Sup-product', (req, res) => {
    res.render('sproduct')
})

app.get('/Sup-product2', (req, res) => {
    res.render('sproduct2')
})
app.get('/promotion', (req, res) => {
    res.render('promotion')
})

app.post('/signIn', async (req, res) => {
    try {
        //console.log(req.body);
        // console.log("here")
        //res.send(req.body);
        const response = await axios.post("http://localhost:8080/api/Authentication/login", req.body, {
            withCredentials: true
        });

        const curUser = await axios.get("http://localhost:8080/api/Authentication/currentUser", {
            withCredentials: true
        });

        console.log("sign in success", response.data);
        // res.redirect(`/`);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
})

app.post('/register', async (req, res) => {
    try {
        // console.log(req.body);
        // console.log("here")
        const response = await axios.post("http://localhost:8080/api/Authentication/register", req.body, {
            withCredential: true
        });
        console.log("register success");
        res.redirect('/signIn');
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
})

app.get('/getProduct', async (req, res) => {
    try {
        //console.log('kuy');
        const products = await axios.get("http://localhost:8080/api/Product/getProduct");
        //console.log(products.data);
        res.render('index',{products: products.data})
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
})

app.get('/getProduct/:id', async (req, res) => {
    try {
        //console.log('kuy');
        const {id} = req.params;
        console.log(id)
        const product = await axios.get(`http://localhost:8080/api/Product/getProduct/${id}`);
        //console.log(product.data);
         res.render('sproduct',{product: product.data})
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
})

app.listen(PORT, () => {
    console.log(`Open server on port ${PORT} complete`)
})
