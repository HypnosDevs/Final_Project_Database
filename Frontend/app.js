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



// app.get('/about', (req, res) => {
//     res.render('about')
// })

// app.get('/contact', (req, res) => {
//     res.render('contact')
// })

app.get('/admin_panel', async (req, res) => {
    const users = await axios.get("http://localhost:8080/api/User/getUsers");
    const products = await axios.get("http://localhost:8080/api/Product/getProduct");
    const orderItems = await axios.get("http://localhost:8080/api/OrderItem/getAllOrderItem");
    const discounts = await axios.get("http://localhost:8080/api/Discount/getDiscount");
    res.render('admin_panel', {
        users: users.data,
        products: products.data,
        orderItems: orderItems.data,
        discounts: discounts.data,
        title: "Admin Panel",
        style: "admin_panel.css"
    })
})

app.get('/cart', (req, res) => {
    res.render('cart', {
        title: "Cart",
        style: "/cart.css",
        cart: "active",
    })
})

app.get('/create_product', (req, res) => {
    res.render('create_product', {
        title: "User Setting Page",
        style: "create_edit.css"
    })
})

app.get('/create_promotion', (req, res) => {
    res.render('create_promotion', {
        title: "User Setting Page",
        style: "create_edit.css",
    })
})

app.get('/edit_by_admin', (req, res) => {
    res.render('edit_by_admin', {
        title: "User Setting Page",
        style: "create_edit.css"
    })
})

app.get('/edit_by_user', (req, res) => {
    res.render('edit_by_user', {
        title: "User Setting Page",
        style: "create_edit.css"
    })
})

app.get('/edit_product', (req, res) => {
    res.render('edit_product', {
        title: "User Setting Page",
        style: "create_edit.css"
    })
})

app.get('/edit_promotion', (req, res) => {
    res.render('edit_promotion', {
        title: "User Setting Page",
        style: "create_edit.css"
    })
})

/*
app.get('/', (req, res) => {
    res.render('index');
})
*/

app.get('/', async (req, res) => {
    try {
        //console.log('kuy');
        const products = await axios.get("http://localhost:8080/api/Product/getProduct");
        //console.log(products.data);
        res.render('index', {
            products: products.data,
            title: "Home",
            style: "/index.css",
            home: "active"
        })
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
})

app.get('/getProduct/:id', async (req, res) => {
    try {
        //console.log('kuy');
        const { id } = req.params;
        console.log(id)
        const product = await axios.get(`http://localhost:8080/api/Product/getProduct/${id}`);
        //console.log(product.data);
        res.render('sproduct', {
            product: product.data,
            title: "Sup-Product",
            style: "/sproduct.css"
        })
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
})

/*
app.post('/getProduct/:id', async (req, res) => {
    try {
        const { id }  = req.params;
        const shoppingCart = await axios.post("http://localhost:8080/api/ShoppingCart/addShoppingCart");
        console.log(shoppingCart);
        const shoppingCartId = shoppingCart._id;
        await axios.post(`http://localhost:8080/api/ShoppingCartItem/${shoppingCartId}/${id}`);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
})
*/

app.get('/product_admin', (req, res) => {
    res.render('product_admin', {
        title: "Product Admin",
        style: "product_admin.css"
    })
})

app.get('/promotion_admin', (req, res) => {
    res.render('promotion_admin', {
        title: "Product Admin",
        style: "promotion_admin.css"
    })
})

app.get('/promotion', (req, res) => {
    res.render('promotion', {
        title: "Promotion",
        style: "promotion.css",
    })
})

app.get('/register', (req, res) => {
    res.render('Register', {
        title: "Register Form",
        style: "/Register_style.css"
    });
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

/*
app.get('/shop', (req, res) => {
    res.render('shop', {
        title: "Shop",
        style: "/index.css",
        shop: "active",
    })
})
*/

app.get('/shop', async (req, res) => {
    try {
        console.log('kuy');
        const products = await axios.get("http://localhost:8080/api/Product/getProduct");
        //console.log(products.data);
        res.render('shop', {
            products: products.data,
            title: "Shop",
            style: "/index.css",
            shop: "active"
        })
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
})

app.get('/signIn', (req, res) => {
    res.render('SignIn', {
        title: "Sing In Form",
        style: "/Sigin_style.css"
    })
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

app.get('/Sup-product', (req, res) => {
    res.render('sproduct', {
        title: "Sup-product",
        style: "/sproduct.css",
    })
})

app.get('/Sup-product2', (req, res) => {
    res.render('sproduct2', {
        title: "Sup-product2",
        style: "/sproduct.css",
    })
})



app.listen(PORT, () => {
    console.log(`Open server on port ${PORT} complete`)
})
