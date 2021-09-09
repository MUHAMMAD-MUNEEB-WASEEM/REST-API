const express = require('express')
const morgan = require('morgan')

const app = express();

const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')

//morgan shows log in terminal or console
app.use(morgan('dev'))

//middleware
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

//middleware for error handling
//if error not caught by above routes, then below works

//This one is for 404 error, and shows error Not Found
app.use((req, res, next)=>{
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
}) 

//This one is for all kind of errors, or 500 error
app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    }) 
})

module.exports = app;