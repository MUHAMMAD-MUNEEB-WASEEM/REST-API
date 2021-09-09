const express = require('express')

const app = express();

const productRoutes = require('./api/routes/products')


//middleware
app.use('/products', productRoutes);

module.exports = app;