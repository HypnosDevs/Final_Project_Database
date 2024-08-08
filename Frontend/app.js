const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios');

require('dotenv').config();
const env = process.env;

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'assets')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const PORT = env.PORT || 9090;
const BACKEND_SERVICE = `http://${env.BACKEND_SERVICE}:${env.BACKEND_PORT}`;

// console.log("Backend service", BACKEND_SERVICE);

// Route for about page
app.get('/about', async (req, res) => {
    try {
        const response = await axios.get(`${BACKEND_SERVICE}/api/about`);
        res.render('about', {
            title: "About",
            style: "/about.css",
            about: "active"
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

// Route for contact page
app.get('/contact', async (req, res) => {
    try {
        const response = await axios.get(`${BACKEND_SERVICE}/api/contact`);
        res.render('contact', {
            title: "Contact",
            style: "/contact.css",
            contact: "active"
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

// Route for home page
app.get('/', async (req, res) => {
    try {
        const products = await axios.get(`${BACKEND_SERVICE}/api/Product/getProduct`);
        console.log("Success home", products);
        res.render('index', {
            products: products.data,
            title: "Home",
            style: "/index.css",
            home: "active",
            BACKEND_SERVICE: BACKEND_SERVICE
        });
    } catch (error) {
        console.log("error", error);
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

// Route for admin panel
app.get('/admin_panel', async (req, res) => {
    try {
        res.render('admin_panel', {
            roles: ["ADMIN", "PRODUCT MANAGER"],
            title: "Admin Panel",
            style: "admin_panel.css"
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

// Route for view page
app.get('/view', (req, res) => {
    res.render('view', {
        roles: ["ADMIN"],
        title: "View",
        style: "/view.css"
    });
});

// Route for cart page
app.get('/cart', (req, res) => {
    res.render('cart', {
        roles: ["ADMIN", "PRODUCT MANAGER", "USER"],
        title: "Cart",
        style: "/cart.css",
        cart: "active",
    });
});

// Route for create payment type page
app.get('/create_payment_type', (req, res) => {
    res.render('create_payment_type', {
        roles: ["ADMIN"],
        title: "User Setting Page",
        style: "create_edit.css"
    });
});

// Route for create product page
app.get('/create_product', (req, res) => {
    res.render('create_product', {
        roles: ["ADMIN", "PRODUCT MANAGER"],
        title: "User Setting Page",
        style: "create_edit.css"
    });
});

// Route for create promotion page
app.get('/create_promotion', (req, res) => {
    res.render('create_promotion', {
        roles: ["ADMIN", "PRODUCT MANAGER"],
        title: "User Setting Page",
        style: "create_edit.css",
    });
});

// Route for edit by admin page
app.get('/edit_by_admin', (req, res) => {
    res.render('edit_by_admin', {
        roles: ["ADMIN"],
        title: "User Setting Page",
        style: "create_edit.css"
    });
});

// Route for edit by user page
app.get('/edit_by_user', (req, res) => {
    res.render('edit_by_user', {
        roles: ["ADMIN", "PRODUCT MANAGER", "USER"],
        title: "User Setting Page",
        style: "create_edit.css"
    });
});

// Route for edit product page by id
app.get('/edit_product/:id', (req, res) => {
    const { id } = req.params;
    res.render('edit_product', {
        roles: ["ADMIN", "PRODUCT MANAGER"],
        product_id: id,
        title: "User Setting Page",
        style: "/create_edit.css"
    });
});

// Route for edit discounts page by id
app.get('/edit_discounts/:id', (req, res) => {
    const { id } = req.params;
    res.render('edit_discounts', {
        roles: ["ADMIN", "PRODUCT MANAGER"],
        discount_id: id,
        title: "User Setting Page",
        style: "/create_edit.css"
    });
});

// Route for edit categories page by id
app.get('/edit_categories/:id', (req, res) => {
    const { id } = req.params;
    res.render('edit_categories', {
        roles: ["ADMIN", "PRODUCT MANAGER"],
        category_id: id,
        title: "User Setting Page",
        style: "/create_edit.css"
    });
});

// Route for get product by id
app.get('/getProduct/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await axios.get(`${BACKEND_SERVICE}/api/Product/getProduct/${id}`);
        res.render('sproduct', {
            product: product.data,
            title: "Sup-Product",
            style: "/sproduct.css"
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

// Route for payment type admin page
app.get('/payment_type_admin', (req, res) => {
    res.render('payment_type_admin', {
        roles: ["ADMIN"],
        title: "Payment Admin",
        style: "payment_type_admin.css"
    });
});

// Route for product admin page
app.get('/product_admin', (req, res) => {
    res.render('product_admin', {
        roles: ["ADMIN", "PRODUCT MANAGER"],
        title: "Product Admin",
        style: "product_admin.css"
    });
});

// Route for promotion admin page
app.get('/promotion_admin', (req, res) => {
    res.render('promotion_admin', {
        roles: ["ADMIN", "PRODUCT MANAGER"],
        title: "Product Admin",
        style: "promotion_admin.css"
    });
});

// Route for promotion page
app.get('/promotion', (req, res) => {
    res.render('promotion', {
        title: "Promotion",
        style: "promotion.css",
    });
});

// Route for register page
app.get('/register', (req, res) => {
    res.render('Register', {
        title: "Register Form",
        style: "/Register_style.css"
    });
});

// Route for handling registration form submission
app.post('/register', async (req, res) => {
    try {
        const response = await axios.post(`${BACKEND_SERVICE}/api/Authentication/register`, req.body, {
            withCredential: true
        });
        console.log("register success");
        res.redirect('/signIn');
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

// Route for shop page
app.get('/shop', async (req, res) => {
    try {
        const products = await axios.get(`${BACKEND_SERVICE}/api/Product/getProduct`);
        res.render('shop', {
            products: products.data,
            title: "Shop",
            style: "/index.css",
            shop: "active"
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

// Route for sign in page
app.get('/signIn', (req, res) => {
    res.render('SignIn', {
        title: "Sign In Form",
        style: "/Sigin_style.css"
    });
});

// Route for handling sign in form submission
app.post('/signIn', async (req, res) => {
    try {
        const response = await axios.post(`${BACKEND_SERVICE}/api/Authentication/login`, req.body, {
            withCredentials: true
        });

        const curUser = await axios.get(`${BACKEND_SERVICE}/api/Authentication/currentUser`, {
            withCredentials: true
        });

        console.log("sign in success", response.data);
        res.redirect(`/`);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

// Route for Sup-product page
app.get('/Sup-product', (req, res) => {
    res.render('sproduct', {
        title: "Sup-product",
        style: "/sproduct.css",
    });
});

// Route for Sup-product2 page
app.get('/Sup-product2', (req, res) => {
    res.render('sproduct2', {
        title: "Sup-product2",
        style: "/index.css",
    });
});

app.get('/trackOrder', (req, res) => {
    res.render('trackOrder', {
        roles: ["ADMIN", "PRODUCT MANAGER", "USER"],
        title: "Track Order",
        style: "/trackOrder.css",
    })
})

app.get('/add_user', (req, res) => {
    res.render('add_user', {
        roles: ["ADMIN"],
        title: "Add User",
        style: "/add_user.css",
    })
})



app.listen(PORT, () => {
    console.log(`Open server on port ${PORT} complete`)
})
