const express = require('express');
const app = express();
const mongoose = require("mongoose");

const session = require('express-session')



cors = require('cors')
require('dotenv').config()
const env = process.env;


const productRouters = require('./Routes/product');
const authRouters = require('./Routes/auth');
const userRouter = require('./Routes/user');
const addressRouter = require('./Routes/address');
const categoryRouters = require('./Routes/category');
const discountRouters = require('./Routes/discount');
const paymentMethodRouters = require('./Routes/paymentMethod');
const paymentTypeRouters = require('./Routes/paymentType');
const shoppingCartRouters = require('./Routes/shoppingCart');
const shoppingCartItemRouters = require('./Routes/shoppingCartItem');
const orderItemRouters = require('./Routes/orderItem');
const orderRouters = require('./Routes/order');

app.use(
    cors({
        origin: 'http://localhost:9090',
        credentials: true
    }),
);



app.use(
    session({
        secret: "secretlaew",
        resave: false,
        saveUninitialized: true,
        // cookie: {
        //     maxAge: 3600000 // 1 hour
        // }
    })
)



app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use('/Images', express.static('Images'))


app.use('/api/Product', productRouters);
app.use('/api/Authentication', authRouters);
app.use('/api/User', userRouter);
app.use('/api/Address', addressRouter);
app.use('/api/Category', categoryRouters);
app.use('/api/Discount', discountRouters);
app.use('/api/PaymentMethod', paymentMethodRouters);
app.use('/api/PaymentType', paymentTypeRouters);
app.use('/api/OrderItem', orderItemRouters);
app.use('/api/Order', orderRouters);
app.use('/api/ShoppingCart', shoppingCartRouters);
app.use('/api/ShoppingCartItem', shoppingCartItemRouters);

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
