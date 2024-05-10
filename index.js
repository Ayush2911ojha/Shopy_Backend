const express = require("express");
const app = express();
const { default: mongoose } = require("mongoose");
const cors = require('cors')
const productsRouter = require('./routes/products.routes')
const brandsRouter = require('./routes/Brand.routes')
const categoriesRouter = require('./routes/Category.routes')
const userRouter = require('./routes/User')
const authRouter = require('./routes/Auth')
const cartRouter = require('./routes/Cart')
const orderRouter = require('./routes/Order')


//middelewares

app.use(cors({
    exposedHeaders: ['X-Total-Count'],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH']
}))
app.use(express.json()); // to parse req.body
app.use('/products', productsRouter.router);
 app.use('/categories', categoriesRouter.router)
app.use('/brands', brandsRouter.router)
 app.use('/users', userRouter.router)
app.use('/auth', authRouter.router)
app.use('/cart', cartRouter.router);
app.use('/orders',  orderRouter.router);
main().catch(err => console.log(err));
async function main() { 

    await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
    console.log("db connected")
}


app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json({ status: "success" });
});












app.listen(8080, () => {
    console.log("server is running  ")
 
})