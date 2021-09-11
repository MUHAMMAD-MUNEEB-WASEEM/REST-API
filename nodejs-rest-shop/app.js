const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')

const app = express();

const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')
const userRoutes = require('./api/routes/users');

//mongodb connection
mongoose.connect('mongodb+srv://admin:Dj21mrMwyo89gAHr@cluster0.dmxhm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

mongoose.Promise = global.Promise


//middleware

//morgan shows log in terminal or console
app.use(morgan('dev'))

//image middleware
app.use('/uploads/', express.static('uploads'))

//body parser which is now replaced by express is used to parse body of your choice
app.use(express.urlencoded({extended: false}))//parse simple bodies of url encoded data
app.use(express.json());//this is to extract json data and make it readable

//Insurance to prevent cors error
app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS'){
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next(); 
})

//middleware to handle routes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

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